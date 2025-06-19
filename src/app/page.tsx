"use client";
import React, {useEffect} from "react";

export default function Page() {
  const [loading, setLoading] = React.useState(true);
  const [deadlines, setDeadlines] = React.useState(null);

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

  return (
    <main>
      <table className="table table-striped">
        <thead>
          <tr>
            <th rowSpan={2}>
              State
            </th>
            <th colSpan={3} style={{textAlign: 'center'}}>
              Deadline
            </th>
            <th rowSpan={2}>
              Description
            </th>
            <th rowSpan={2}>
              Election day registration?
            </th>
            <th rowSpan={2}>
              Online registration
            </th>
          </tr>
          <tr>
            <th>
              By mail
            </th>
            <th>
              In person
            </th>
            <th>
              Online
            </th>
          </tr>
        </thead>
        <tbody>
          {deadlines.map((deadline, index) => (
            <tr key={index}>
              <td style={{whiteSpace: 'nowrap'}}>
                {deadline.State.trim() || "Unknown state"}
              </td>
              <td>
                {formatDate(deadline.DeadlineByMail)}
              </td>
              <td>
                {formatDate(deadline.DeadlineInPerson)}
              </td>
              <td>
                {formatDate(deadline.DeadlineOnline)}
              </td>
              <td>
                {deadline.Description.trim() || "No description available"}
              </td>
              <td>
                {deadline.ElectionDayRegistration.trim() || "No"}
              </td>
              <td>
                {deadline.OnlineRegistrationLink.trim()
                  ? linkToNonArchiveDomain(deadline.OnlineRegistrationLink.trim())
                  : "Link unavailable. Visit the state government homepage for information about registering to vote online."
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
