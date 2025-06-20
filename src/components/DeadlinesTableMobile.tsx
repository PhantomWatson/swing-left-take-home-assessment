export default function DeadlinesTableMobile({table, flexRender}) {
  return (
    <div>
      {table.getRowModel().rows.map(row => {
        const cells = row.getVisibleCells();

        // Use Tanstack Table's flexRender to format content
        const formattedContent = {};
        cells.forEach(cell => {
          formattedContent[cell.column.id] = flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          );
        });

        return (
          <div key={row.id} className="card m-2 p-2">
            <p style={{borderBottom: '1px solid #ccc', marginBottom: '0.5em'}}>
              <strong style={{fontSize: '1.2em'}}>{formattedContent['State']}</strong>
            </p>
            <ul style={{marginBottom: 0}}>
              <li>
                <strong>Deadlines</strong>
                <ul>
                  <li><strong>By mail:</strong> {formattedContent['DeadlineByMail']}</li>
                  <li><strong>In person:</strong> {formattedContent['DeadlineInPerson']}</li>
                  <li><strong>Online:</strong> {formattedContent['DeadlineOnline']}</li>
                </ul>
              </li>
              <li>
                <strong>Registration requirements:</strong> {formattedContent['Description']}
              </li>
              <li>
                <strong>Election day registration?</strong> {formattedContent['ElectionDayRegistration']}
              </li>
              <li>
                <strong>Online registration:</strong> {formattedContent['OnlineRegistrationLink']}
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}
