// Seed script — pre-populate Sanity with initial content
// Run: npx sanity exec seed.ts --with-user-token
import { getCliClient } from 'sanity/cli'
import type { IdentifiedSanityDocumentStub } from '@sanity/client'

const client = getCliClient()

const documents: IdentifiedSanityDocumentStub[] = [
  {
    "_type": "siteSettings",
    "_id": "siteSettings",
    "siteName": "Powder Ridge HOA",
    "ctaLabel": "Get Started",
    "ctaUrl": "/contact",
    "contactEmail": "powderridgesecretary@gmail.com",
    "contactPhone": "",
    "contactAddress": "",
    "copyrightText": "© 2026 Powder Ridge HOA. All rights reserved."
  },
  {
    "_type": "page",
    "_id": "page-home",
    "title": "Home",
    "slug": {
      "_type": "slug",
      "current": "/"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0",
        "title": "Powder Ridge HOA",
        "subtitle": ""
      },
      {
        "_type": "featureGrid",
        "_key": "featureGrid-1"
      },
      {
        "_type": "pricingCtaSection",
        "_key": "pricingCtaSection-2"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-about",
    "title": "About",
    "slug": {
      "_type": "slug",
      "current": "/about"
    },
    "sections": []
  },
  {
    "_type": "page",
    "_id": "page-contact",
    "title": "Contact",
    "slug": {
      "_type": "slug",
      "current": "/contact"
    },
    "sections": [
      {
        "_type": "contactSection",
        "_key": "contactSection-0",
        "email": "powderridgesecretary@gmail.com"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-faqs",
    "title": "FAQs",
    "slug": {
      "_type": "slug",
      "current": "/faqs"
    },
    "sections": [
      {
        "_type": "faqSection",
        "_key": "faqSection-0"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-ccrs",
    "title": "CCRs",
    "slug": {
      "_type": "slug",
      "current": "/ccrs"
    },
    "sections": [
      {
        "_type": "textContent",
        "_key": "textContent-0"
      },
      {
        "_type": "pricingCtaSection",
        "_key": "pricingCtaSection-1"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-board-members",
    "title": "Board Members",
    "slug": {
      "_type": "slug",
      "current": "/board-members"
    },
    "sections": [
      {
        "_type": "teamProjectsSection",
        "_key": "teamProjectsSection-0"
      },
      {
        "_type": "textContent",
        "_key": "textContent-1"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-board-minutes",
    "title": "Board Minutes",
    "slug": {
      "_type": "slug",
      "current": "/board-minutes"
    },
    "sections": [
      {
        "_type": "faqSection",
        "_key": "faqSection-0"
      }
    ]
  },
  {
    "_type": "page",
    "_id": "page-directory",
    "title": "Directory",
    "slug": {
      "_type": "slug",
      "current": "/directory"
    },
    "sections": [
      {
        "_type": "heroSection",
        "_key": "heroSection-0"
      }
    ]
  },
  {
    "_type": "legalPage",
    "_id": "legal-privacy-policy",
    "title": "Privacy Policy",
    "slug": {
      "_type": "slug",
      "current": "/privacy-policy"
    }
  },
  {
    "_type": "legalPage",
    "_id": "legal-terms-and-conditions",
    "title": "Terms & Conditions",
    "slug": {
      "_type": "slug",
      "current": "/terms-and-conditions"
    }
  },
  {
    "_type": "legalPage",
    "_id": "legal-accessibility",
    "title": "Accessibility Statement",
    "slug": {
      "_type": "slug",
      "current": "/accessibility"
    }
  },
  {
    "_type": "navigation",
    "_id": "nav-main",
    "navType": "main",
    "items": [
      {
        "_key": "home",
        "label": "Home",
        "url": "/"
      },
      {
        "_key": "contact",
        "label": "Contact",
        "url": "/contact"
      },
      {
        "_key": "faqs",
        "label": "FAQs",
        "url": "/faqs"
      },
      {
        "_key": "ccrs",
        "label": "CCRs",
        "url": "/ccrs"
      },
      {
        "_key": "board-members",
        "label": "Board Members",
        "url": "/board-members"
      },
      {
        "_key": "board-minutes",
        "label": "Board Minutes",
        "url": "/board-minutes"
      }
    ]
  },
  {
    "_type": "navigation",
    "_id": "nav-legal",
    "navType": "legal",
    "items": [
      {
        "_key": "privacy-policy",
        "label": "Privacy Policy",
        "url": "/privacy-policy"
      },
      {
        "_key": "terms-and-conditions",
        "label": "Terms & Conditions",
        "url": "/terms-and-conditions"
      },
      {
        "_key": "accessibility",
        "label": "Accessibility Statement",
        "url": "/accessibility"
      }
    ]
  }
]

async function seed() {
  console.log(`Seeding ${documents.length} document(s)...`)
  const transaction = client.transaction()
  for (const doc of documents) {
    transaction.createIfNotExists(doc)
  }
  await transaction.commit()
  console.log('Seed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
