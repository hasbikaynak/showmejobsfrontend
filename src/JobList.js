import React, { useState, useEffect } from 'react';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [jobData, setJobData] = useState({
    role: '',
    seniority: null,
    companyName: '',
    date: new Date().toISOString(),
    salary: 0,
    city: '',
    workType: null,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const response = await fetch('http://localhost:8080/api/v1/job/all');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }

  async function addJob() {
    try {
      const response = await fetch('http://localhost:8080/api/v1/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      console.log('Job added:', data);
      fetchJobs();
      setShowPopup(false);
      setJobData({
        role: '',
        seniority: null,
        companyName: '',
        date: new Date().toISOString(),
        salary: 0,
        city: '',
        workType: null,
      });
    } catch (error) {
      console.error('Error adding job:', error);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div>
      <h1>Job List</h1>
      <button onClick={() => setShowPopup(true)}>Add Job</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Role</th>
            <th>City</th>
            <th>Company Name</th>
            <th>Date</th>
            <th>Salary</th>
            <th>Seniority</th>
            <th>Work Type</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.role}</td>
              <td>{job.city}</td>
              <td>{job.companyName}</td>
              <td>{new Date(job.date).toLocaleDateString()} {new Date(job.date).toLocaleTimeString()}</td>
              <td>{job.salary}</td>
              <td>{job.seniority}</td>
              <td>{job.workType}</td>
            </tr>
          ))}
        </tbody>
      </table>

{showPopup && (
  <div className="popup">
    <div className="popup-content">
      <h2>Add Job</h2>
      <form onSubmit={addJob}>
        <label>
          Role:
          <input type="text" name="role" value={jobData.role} onChange={handleInputChange} required />
        </label>
        <label>
          Seniority:
          <select name="seniority" value={jobData.seniority} onChange={handleInputChange} required>
            <option value="">Select Seniority</option>
            <option value="INTERN">Intern</option>
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid Level</option>
            <option value="SENIOR">Senior</option>
          </select>
        </label>
        <label>
          Company Name:
          <input type="text" name="companyName" value={jobData.companyName} onChange={handleInputChange} required />
        </label>
        <label>
          Date:
          <input type="datetime-local" name="date" value={jobData.date} onChange={handleInputChange} required />
        </label>
        <label>
          Salary:
          <input type="number" name="salary" value={jobData.salary} onChange={handleInputChange} required />
        </label>
        <label>
          City:
          <input type="text" name="city" value={jobData.city} onChange={handleInputChange} required />
        </label>
        <label>
          Work Type:
          <select name="workType" value={jobData.workType} onChange={handleInputChange} required>
            <option value="">Select Work Type</option>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
            <option value="ONSITE">Onsite</option>
          </select>
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default JobList;
