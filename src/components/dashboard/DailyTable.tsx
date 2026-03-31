'use client'
 
import React, { useState } from 'react'
import { cn } from '@/lib/utils'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LancamentoCompleto } from '@/types'
import { formatDate, formatCurrency } from '@/lib/formatters'
import { ROASBadge, ROIBadge } from '../shared/ROASBadge'
import { LucroBadge } from '../shared/LucroBadge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash, ChevronDown, ChevronUp, DollarSign, Target, BarChart, Info } from 'lucide-react'
import { deletarLancamento } from '@/lib/api'
import { toast } from 'sonner'

interface DailyTableProps {
  data: LancamentoCompleto[]
  onEdit: (lancamento: LancamentoCompleto) => void
}

export function DailyTable({ data, onEdit }: DailyTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>DIA / OFERTA</TableHead>
              <TableHead className="text-right">VENDAS</TableHead>
              <TableHead className="text-right">LUCRO</TableHead>
              <TableHead className="text-right">ROI</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Info className="h-8 w-8 opacity-20" />
                    <p>Nenhum lançamento encontrado para o período.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow 
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/30",
                      expandedId === row.id && "bg-muted/50 border-b-0"
                    )}
                    onClick={() => toggleExpand(row.id)}
                  >
                    <TableCell>
                      {expandedId === row.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{formatDate(row.data)}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.oferta_cor }} />
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">{row.oferta_nome}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">{row.vendas_front}</TableCell>
                    <TableCell className="text-right">
                      <LucroBadge value={row.lucro} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ROIBadge value={row.roi} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ROASBadge value={row.roas} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
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
                  
                  {/* Linha de Detalhes Expandida */}
                  {expandedId === row.id && (
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-t-0 border-b-2">
                      <TableCell colSpan={7} className="p-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pt-0">
                          <div className="rounded-lg bg-background/50 border p-3">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Custo Total</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono">{formatCurrency(row.investimento_com_imposto, 'BRL')}</span>
                              <BarChart className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <p className="text-[9px] text-muted-foreground/60 mt-1">Sendo {formatCurrency(row.investimento, 'BRL')} + imposto</p>
                          </div>

                          <div className="rounded-lg bg-background/50 border p-3">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Receita R$</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-emerald-500">{formatCurrency(row.receita_brl, 'BRL')}</span>
                              <DollarSign className="h-3 w-3 text-emerald-500" />
                            </div>
                            <p className="text-[9px] text-muted-foreground/60 mt-1">Base: {formatCurrency(row.receita_usd, 'USD')} @ {row.cotacao_dolar}</p>
                          </div>

                          <div className="rounded-lg bg-background/50 border p-3">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">CPA Médio</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold">{formatCurrency(row.cpa, 'BRL')}</span>
                              <Target className="h-3 w-3 text-orange-500" />
                            </div>
                          </div>

                          <div className="flex items-end justify-end pb-1">
                            <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => onEdit(row)}>
                               <Pencil className="mr-1.5 h-3 w-3" /> Editar lançamento
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
