import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AcompanhamentoSemanal } from '@/types'
import { formatDate, formatCurrency } from '@/lib/formatters'
import { ROASBadge, ROIBadge } from '../shared/ROASBadge'
import { LucroBadge } from '../shared/LucroBadge'

interface WeeklyTableProps {
  data: AcompanhamentoSemanal[]
}

export function WeeklyTable({ data }: WeeklyTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>INÍCIO</TableHead>
              <TableHead>SEMANA</TableHead>
              <TableHead>OFERTA</TableHead>
              <TableHead className="text-right">INVESTIMENTO</TableHead>
              <TableHead className="text-right">RECEITA</TableHead>
              <TableHead className="text-right">LUCRO</TableHead>
              <TableHead className="text-right">ROI</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum dado semanal encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={`${row.oferta_id}-${row.inicio_semana}`}>
                  <TableCell>{formatDate(row.inicio_semana)}</TableCell>
                  <TableCell className="font-medium">Semana {row.numero_semana}</TableCell>
                  <TableCell className="text-muted-foreground">{row.oferta_nome}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(row.investimento_total, 'BRL')}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(row.receita_total, 'BRL')}</TableCell>
                  <TableCell className="text-right">
                    <LucroBadge value={row.lucro_total} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ROIBadge value={row.roi} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ROASBadge value={row.roas} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
