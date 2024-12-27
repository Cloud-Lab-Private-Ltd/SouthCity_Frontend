"use client";

import { useState, useCallback, useRef } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Pencil, Eye } from "lucide-react";

interface User {
  id: number;
  role: string;
  username: string;
}

const initialData: User[] = [
  { id: 1, role: "Admin", username: "admin_user" },
  { id: 2, role: "Editor", username: "editor_user" },
  { id: 3, role: "Viewer", username: "viewer_user" },
];

export default function DashboardTable() {
  const [data, setData] = useState<User[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.role.toLowerCase().includes(searchLower) ||
      item.username.toLowerCase().includes(searchLower)
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / parseInt(rowsPerPage));
  const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
  const endIndex = startIndex + parseInt(rowsPerPage);
  const currentData = filteredData.slice(startIndex, endIndex);

  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentData.map((row) => row.id)));
    }
  }, [currentData, selectedRows]);

  const toggleRow = useCallback((id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-64"
        />
      </div>

      <div className="rounded-md">
        <Table className="[&_tr:hover]:bg-gray-50 [&_td]:border-0 [&_th]:border-0">
          <TableHeader className="border-b">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedRows.size === currentData.length &&
                    currentData.length > 0
                  }
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(user.id)}
                    onCheckedChange={() => toggleRow(user.id)}
                  />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => {
                        setData(data.filter((d) => d.id !== user.id));
                        setSelectedRows((prev) => {
                          const next = new Set(prev);
                          next.delete(user.id);
                          return next;
                        });
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
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(e.target.value);
              setCurrentPage(1);
            }}
            className="w-16 border rounded-md"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
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
  );
}
