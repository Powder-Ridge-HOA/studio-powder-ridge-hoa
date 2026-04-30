import { getCliClient } from 'sanity/cli'
import * as fs from 'fs'
import * as path from 'path'

// Sync resident docs in Sanity from ../parsed-residents.json (the parser
// output). Default mode prints the planned mutations without applying.
// To apply, set the APPLY env var to a truthy value, e.g.:
//   APPLY=1 npx sanity exec syncResidents.ts --with-user-token
// (--apply on the command line is intercepted by the Sanity CLI itself.)
//
// Rules per agreement with the user:
//  - Preserve existing nickname and groupmembership on updated docs
//  - Replace firstname, lastname, address, email, phone, organization, notes
//  - Move secondary emails/phones from the parser into additionalContacts
//    (name field left blank; user fills in afterward)
//  - For multi-row Sanity addresses (395, 406): keep one doc, update fields,
//    delete the rest

const APPLY = !!process.env.APPLY
const client = getCliClient()
const PARSED_PATH = path.resolve(__dirname, '../parsed-residents.json')

interface ParsedRecord {
  firstname: string
  lastname: string
  organization: string
  address: string
  email: string
  secondaryEmails: string[]
  phone: string
  secondaryPhones: string[]
  notes: string
  sourceHeader?: string
}

interface SanityResident {
  _id: string
  _rev?: string
  firstname?: string
  lastname?: string
  nickname?: string
  address?: string
  email?: string
  phone?: string
  organization?: string
  notes?: string
  groupmembership?: string
  additionalContacts?: Array<{ name?: string; email?: string; phone?: string; _key?: string }>
}

const norm = (s?: string) =>
  String(s || '')
    .toLowerCase()
    .replace(/\bct\b\.?/gi, 'court')
    .replace(/\s+/g, ' ')
    .trim()

const newKey = () => Math.random().toString(36).slice(2, 10)

function buildAdditionalContacts(rec: ParsedRecord) {
  const contacts: Array<{ _key: string; name: string; email?: string; phone?: string }> = []
  const maxLen = Math.max(rec.secondaryEmails.length, rec.secondaryPhones.length)
  for (let i = 0; i < maxLen; i++) {
    const c: { _key: string; name: string; email?: string; phone?: string } = { _key: newKey(), name: '' }
    if (rec.secondaryEmails[i]) c.email = rec.secondaryEmails[i]
    if (rec.secondaryPhones[i]) c.phone = rec.secondaryPhones[i]
    if (c.email || c.phone) contacts.push(c)
  }
  return contacts
}

function recordPatchFields(rec: ParsedRecord) {
  return {
    firstname: rec.firstname,
    lastname: rec.lastname,
    address: rec.address,
    email: rec.email,
    phone: rec.phone,
    organization: rec.organization,
    notes: rec.notes,
    additionalContacts: buildAdditionalContacts(rec),
  }
}

async function main() {
  const parsed = JSON.parse(fs.readFileSync(PARSED_PATH, 'utf8')) as ParsedRecord[]
  const sanity = await client.fetch<SanityResident[]>(`*[_type == "resident"]`)

  const sanityByAddr = new Map<string, SanityResident[]>()
  for (const r of sanity) {
    const k = norm(r.address)
    if (!sanityByAddr.has(k)) sanityByAddr.set(k, [])
    sanityByAddr.get(k)!.push(r)
  }

  const plan: {
    creates: ParsedRecord[]
    updates: { existing: SanityResident; rec: ParsedRecord }[]
    deletes: SanityResident[]
  } = { creates: [], updates: [], deletes: [] }

  for (const rec of parsed) {
    const matches = sanityByAddr.get(norm(rec.address)) || []
    if (!matches.length) {
      plan.creates.push(rec)
      continue
    }
    plan.updates.push({ existing: matches[0], rec })
    if (matches.length > 1) {
      for (const extra of matches.slice(1)) plan.deletes.push(extra)
    }
  }

  console.log(`Plan:\n  CREATE: ${plan.creates.length}\n  UPDATE: ${plan.updates.length}\n  DELETE: ${plan.deletes.length} (extras from multi-row merges)`)
  console.log('')

  if (plan.creates.length) {
    console.log('CREATE addresses:')
    for (const c of plan.creates) console.log(`  + ${c.address}`)
    console.log('')
  }
  if (plan.deletes.length) {
    console.log('DELETE docs (merge extras):')
    for (const d of plan.deletes) console.log(`  - ${d._id}  ${d.address}  ${d.firstname || ''} ${d.lastname || ''}`)
    console.log('')
  }

  if (!APPLY) {
    console.log('Dry-run only. Re-run with --apply to commit changes.')
    return
  }

  const tx = client.transaction()
  for (const c of plan.creates) {
    tx.create({
      _type: 'resident',
      ...recordPatchFields(c),
    })
  }
  for (const { existing, rec } of plan.updates) {
    tx.patch(existing._id, {
      set: recordPatchFields(rec),
    })
  }
  for (const d of plan.deletes) {
    tx.delete(d._id)
  }

  const result = await tx.commit()
  console.log('Applied. Transaction ID:', result.transactionId)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
