# Gov Adoption Radar

Gov Adoption Radar is a Next.js MVP that maps a portfolio company to government adoption pathways using:

- FY26 DoD budget themes as the budget-priority layer
- DoW Directory-style stakeholder mapping as the engagement layer
- Stubbed and source-aware adapters for SAM.gov, SBIR.gov, USAspending.gov, and Grants.gov

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Create `.env.local` from `.env.example`.

- `SAM_GOV_API_KEY`
- `GRANTS_GOV_API_KEY`

## Notes

- The MVP intentionally supports `live`, `demo`, and `disabled` source states so the product looks credible before every data adapter is fully wired.
- Stakeholder pathways are structured from user-provided reference materials and do not republish directory content.
