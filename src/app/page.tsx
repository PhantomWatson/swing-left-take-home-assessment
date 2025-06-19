"use client";

import React, {useEffect} from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  createColumnHelper
} from '@tanstack/react-table'

export default function Page() {
  const [loading, setLoading] = React.useState(true);
  const [deadlines, setDeadlines] = React.useState<Deadline[] | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([{id: 'State', desc: false}]);

  type Deadline = {
    State: string;
    DeadlineInPerson: string;
    DeadlineByMail: string;
    DeadlineOnline: string;
    ElectionDayRegistration: string;
    OnlineRegistrationLink: string;
    Description: string;
  };

  const columnHelper = createColumnHelper();

  const columns = [
    {
      accessorKey: 'State',
      cell: info => info.getValue().trim() || "Unknown state",
      header: () => 'State',
      rowSpan: 2,
    },
    columnHelper.group({
      id: 'Deadline',
      header: () => 'Deadline',
      enableSorting: false,
      columns: [
        columnHelper.accessor('DeadlineByMail', {
          header: () => 'By mail',
          cell: info => formatDate(info.getValue()),
        }),
        columnHelper.accessor('DeadlineInPerson', {
          header: () => 'In person',
          cell: info => formatDate(info.getValue()),
        }),
        columnHelper.accessor('DeadlineOnline', {
          header: () => 'Online',
          cell: info => formatDate(info.getValue()),
        }),
      ],
    }),
    {
      accessorKey: 'Description',
      cell: info => info.getValue().trim() || "No description available",
      header: () => 'Description',
      rowSpan: 2,
    },
    {
      accessorKey: 'ElectionDayRegistration',
      cell: info => info.getValue().trim() || "No",
      header: () => 'Election day registration?',
      rowSpan: 2,
    },
    {
      accessorKey: 'OnlineRegistrationLink',
      cell: info => {
        const link = info.getValue().trim();
        return link ? linkToNonArchiveDomain(link) : "Link unavailable. Visit the state government homepage for information about registering to vote online.";
      },
      header: () => 'Online registration',
      rowSpan: 2,
    }
  ];

  const table = useReactTable({
    columns,
    data: deadlines || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    state: {sorting},
  });

  useEffect(() => {
    const load = async () => {
      const fetchUrl = 'http://localhost:3000/api/registration_deadlines';
      const deadlines = await fetch(fetchUrl)
        .then(response => response.json());
      setLoading(false);
      if (deadlines && Array.isArray(deadlines)) {
        setDeadlines(deadlines);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="alert">Loading...</div>;
  }

  if (!deadlines || deadlines.length === 0) {
    return <div className="alert alert-warning">No voter registration deadlines were found.</div>;
  }

  const linkToNonArchiveDomain = (url) => {
    if (!url) {
      return null;
    }
    const govDomain = (url.match(/(https?:\/\/[^\/]+)/g) || [])
      .map(m => m.match(/https?:\/\/([^\/]+)/)[1])
      .find(domain => !domain.endsWith('archive.org')) || url;
    if (govDomain) {
      return (
        <a href={url}>
          {govDomain}
        </a>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unknown date";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const sortableTable = (
    <div className="p-2">
      <div className="h-2" />
      <table className="table table-striped">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      textAlign: header.colSpan > 1 ? 'center' : 'left',
                      borderTopWidth: header.colSpan > 1 ? '1px' : '0px',
                      borderLeftWidth: header.colSpan > 1 ? '1px' : '0px',
                      borderRightWidth: header.colSpan > 1 ? '1px' : '0px',
                      borderBottomWidth: header.colSpan > 1 ? '0px' : '1px',
                  }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        style={{
                          cursor: header.column.getCanSort() ? 'pointer' : 'default',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <main>
      {sortableTable}
    </main>
  );
}
