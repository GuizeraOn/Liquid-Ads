'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LancamentoCompleto } from '@/types'
import { formatDate, formatCurrency } from '@/lib/formatters'
import { ROASBadge } from '../shared/ROASBadge'
import { LucroBadge } from '../shared/LucroBadge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { deletarLancamento } from '@/lib/api'
import { toast } from 'sonner'

interface DailyTableProps {
  data: LancamentoCompleto[]
  onEdit: (lancamento: LancamentoCompleto) => void
}

export function DailyTable({ data, onEdit }: DailyTableProps) {
  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
      try {
        await deletarLancamento(id)
        toast.success('Lançamento excluído com sucesso')
      } catch (error: any) {
        toast.error(error.message || 'Erro ao excluir lançamento')
      }
    }
  }

  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">OFERTA</TableHead>
              <TableHead>DIA</TableHead>
              <TableHead className="text-right">VENDAS</TableHead>
              <TableHead className="text-right">INVEST</TableHead>
              <TableHead className="text-right">C/ IMP</TableHead>
              <TableHead className="text-right">REC U$</TableHead>
              <TableHead className="text-right">REC R$</TableHead>
              <TableHead className="text-right">CPA</TableHead>
              <TableHead className="text-right">LUCRO</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  Nenhum lançamento encontrado para o período.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.oferta_cor }} />
                      {row.oferta_nome}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(row.data)}</TableCell>
                  <TableCell className="text-right font-mono">{row.vendas_front}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.investimento, 'BRL')}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(row.investimento_com_imposto, 'BRL')}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(row.receita_usd, 'USD')}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(row.receita_brl, 'BRL')}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(row.cpa, 'BRL')}</TableCell>
                  <TableCell className="text-right">
                    <LucroBadge value={row.lucro} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ROASBadge value={row.roas} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(row)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(row.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
