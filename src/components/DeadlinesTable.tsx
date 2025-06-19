import React, {useEffect} from "react";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { sortByDate, formatDate } from "../util/date";
import { Deadline } from "../models/VoterRegistrationDeadline";

export default function DeadlinesTable() {
  const [loading, setLoading] = React.useState(true);
  const [deadlines, setDeadlines] = React.useState<Deadline[] | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([{id: 'State', desc: false}]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const columnHelper = createColumnHelper();

  const columns = [
    {
      accessorKey: 'State',
      cell: info => info.getValue().trim() || "Unknown state",
      header: () => 'State',
      rowSpan: 2,
      enableGlobalFilter: true,
    },
    columnHelper.group({
      id: 'Deadline',
      header: () => 'Deadline',
      enableSorting: false,
      enableGlobalFilter: false,
      columns: [
        columnHelper.accessor('DeadlineByMail', {
          header: () => 'By mail',
          cell: info => formatDate(info.getValue()),
          sortingFn: sortByDate,
        }),
        columnHelper.accessor('DeadlineInPerson', {
          header: () => 'In person',
          cell: info => formatDate(info.getValue()),
          sortingFn: sortByDate,
        }),
        columnHelper.accessor('DeadlineOnline', {
          header: () => 'Online',
          cell: info => formatDate(info.getValue()),
          sortingFn: sortByDate,
        }),
      ],
    }),
    {
      accessorKey: 'Description',
      cell: info => info.getValue().trim() || "No description available",
      header: () => 'Description',
      rowSpan: 2,
      enableGlobalFilter: false,
    },
    {
      accessorKey: 'ElectionDayRegistration',
      cell: info => info.getValue().trim() || "No",
      header: () => 'Election day registration?',
      rowSpan: 2,
      enableGlobalFilter: false,
    },
    {
      accessorKey: 'OnlineRegistrationLink',
      cell: info => {
        const link = info.getValue().trim();
        return link ? linkToNonArchiveDomain(link) : "Link unavailable. Visit the state government homepage for information about registering to vote online.";
      },
      header: () => 'Online registration',
      rowSpan: 2,
      enableGlobalFilter: false,
    }
  ];

  const table = useReactTable({
    columns,
    data: deadlines || [],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    state: {sorting, globalFilter},
    onGlobalFilterChange: setGlobalFilter,
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

  if (loading) {
    return <div className="alert">Loading...</div>;
  }

  if (!deadlines || deadlines.length === 0) {
    return <div className="alert alert-warning">No voter registration deadlines were found.</div>;
  }

  return (
    <>
      <div className="my-2">
        <div className="form-group mx-2">
          <label htmlFor="filter-by-state" className="me-2">Filter by state:</label>
          <input
            id="filter-by-state"
            value={globalFilter}
            onChange={e => {
              table.setGlobalFilter(String(e.target.value));
            }}
            placeholder="Enter state name"
          />
        </div>
      </div>

      <div className="p-2">
        <div className="h-2"/>
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
            if (!row.getVisibleCells()) {
              return null;
            }

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
    </>
  );
}
