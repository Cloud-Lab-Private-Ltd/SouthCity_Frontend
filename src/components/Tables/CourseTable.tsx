"use client"

import { useState, useCallback, useRef } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Pencil, Eye, Printer, Download, Upload } from 'lucide-react'

interface Group {
  id: number
  groupName: string
  description: string
  allowedGroups: string
}

const initialData: Group[] = [
  {
    id: 1,
    groupName: "Medical Students",
    description: "first-year medical students",
    allowedGroups: "4"
  },
  {
    id: 2,
    groupName: "Nursing Faculty",
    description: "third-year medical students",
    allowedGroups: "6"
  },
  {
    id: 3,
    groupName: "Physiotherapy",
    description: "first-year Physiotherapy students",
    allowedGroups: "3"
  }
]

export default function CourseTable() {
  const [data, setData] = useState<Group[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState("15")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Search functionality
  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      item.groupName.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.allowedGroups.toLowerCase().includes(searchLower)
    )
  })

  // Pagination calculations
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / parseInt(rowsPerPage))
  const startIndex = (currentPage - 1) * parseInt(rowsPerPage)
  const endIndex = startIndex + parseInt(rowsPerPage)
  const currentData = filteredData.slice(startIndex, endIndex)

  // Row selection handlers
  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(currentData.map(row => row.id)))
    }
  }, [currentData, selectedRows])

  const toggleRow = useCallback((id: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Print functionality
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // CSV Export functionality
  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Group Name', 'Description', 'Allowed Groups']
    const csvData = [
      headers.join(','),
      ...filteredData.map(row => 
        [row.id, row.groupName, row.description, row.allowedGroups].join(',')
      )
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'groups.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, [filteredData])

  // CSV Import functionality
  const importCSV = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const rows = text.split('\n').slice(1) // Skip header row
        const newData = rows
          .filter(row => row.trim())
          .map((row, index) => {
            const [id, groupName, description, allowedGroups] = row.split(',')
            return {
              id: parseInt(id) || index + 1,
              groupName: groupName?.trim() || '',
              description: description?.trim() || '',
              allowedGroups: allowedGroups?.trim() || ''
            }
          })
        setData(newData)
      }
      reader.readAsText(file)
    }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="space-x-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button
            variant="outline"
            className="space-x-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            <span>Import CSV</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={importCSV}
          />
          <Button variant="outline" className="space-x-2" onClick={exportCSV}>
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
            className="w-64"
          />
        </div>
      </div>

      <div className="rounded-md">
        <Table className="[&_tr:hover]:bg-gray-50 [&_td]:border-0 [&_th]:border-0">
          <TableHeader className="border-b">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedRows.size === currentData.length && currentData.length > 0}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Allowed Groups</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.has(group.id)}
                    onCheckedChange={() => toggleRow(group.id)}
                  />
                </TableCell>
                <TableCell>{group.id}</TableCell>
                <TableCell>{group.groupName}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>{group.allowedGroups}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500"
                      onClick={() => {
                        setData(data.filter(d => d.id !== group.id))
                        setSelectedRows(prev => {
                          const next = new Set(prev)
                          next.delete(group.id)
                          return next
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-blue-500">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Rows per page</span>
          <Select 
            value={rowsPerPage} 
            onValueChange={(value) => {
              setRowsPerPage(value)
              setCurrentPage(1) // Reset to first page when changing rows per page
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue>{rowsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>
          <span className="text-sm">
            {currentPage} / {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            {">"}
          </Button>
        </div>
      </div>
    </div>
  )
}
