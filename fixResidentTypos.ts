import { getCliClient } from 'sanity/cli'

// Fix two email typos that came in from the parsed txt source. The user
// confirmed the older Auth0 email format is correct in both cases:
//   ivi3_shelli@hotmail.com  →  ivie_shelli@hotmail.com (Shideler, 427 PRC)
//   jlummis@me.com           →  j.lummis@me.com         (Lummis, 403 PRC)

const APPLY = !!process.env.APPLY
const client = getCliClient()

const FIXES: { wrong: string; right: string }[] = [
  { wrong: 'ivi3_shelli@hotmail.com', right: 'ivie_shelli@hotmail.com' },
  { wrong: 'jlummis@me.com', right: 'j.lummis@me.com' },
]

async function main() {
  for (const { wrong, right } of FIXES) {
    const docs = await client.fetch<Array<{ _id: string; address?: string; email?: string }>>(
      `*[_type == "resident" && email == $wrong]{_id, address, email}`,
      { wrong },
    )
    if (!docs.length) {
      console.log(`No resident has email ${wrong} — skipping`)
      continue
    }
    for (const d of docs) {
      console.log(`${d.address || d._id}: ${wrong}  →  ${right}`)
      if (APPLY) await client.patch(d._id).set({ email: right }).commit()
    }
  }
  if (!APPLY) console.log('\nDry-run only. Re-run with APPLY=1 to commit.')
}

main().catch((e) => { console.error(e); process.exit(1) })
