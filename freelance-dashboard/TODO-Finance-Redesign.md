# Finance Page Redesign Plan ✅

## Information Gathered:
- UI Components ready: Card, KpiCard, SectionHeader, Button from components/ui
- Current page: Complex charts → replace with spec components
- Data: Single projects fetch + realtime ✅ keep
- Theme: Dark (#111 cards, #262 borders, accent colors)

## Plan:
1. **Keep:** Data fetch, realtime subscription, types, utils
2. **Replace charts → spec sections** (no recharts import)
3. **New components:** Table, RecentTransactions list, TopClients list, MonthlySummary text
4. **Logic:** All from single projects array (no new queries)

## File-level Changes:
**freelance-dashboard/app/finance/page.tsx** (complete rewrite):
- Section 1: 4 KpiCards (logic matches spec)
- Section 2: Recent transactions (top 5 completed, sorted completed_at DESC)
- Section 3: Full projects table (client, service, budget, final_price, status)
- Section 4: Top 3 clients (group by client_name, sum final_price)
- Section 5: Pending block (2 KPIs)
- Section 6: Monthly text list (12 months, completed_at grouping)
- Remove: Charts import, chart logic, leads (not in spec)

**Dependent files:** None (self-contained)

## Followup:
- Test realtime updates
- Empty states for no data
- Matches dashboard styling

Ready to implement - confirm?
