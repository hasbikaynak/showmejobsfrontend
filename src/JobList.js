import React, { useState, useEffect } from 'react';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [jobToUpdate, setJobToUpdate] = useState(null);
  const [jobData, setJobData] = useState({
    role: '',
    seniority: null,
    companyName: '',
    date: new Date().toISOString(),
    salary: 0,
    city: '',
    workType: null,
  });
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  async function fetchJobs() {
    try {
      const response = await fetch('http://localhost:8080/api/v1/job/all');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }

  async function addJob(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Job added:', data);
        setSuccessMessage('Job added successfully');
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
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Error adding job:', error);
      setErrorMessage(error.message || 'An error occurred while adding the job.');
      setTimeLeft(10);
      setTimeout(() => {
        setErrorMessage('');
        setTimeLeft(0);
      }, 10000);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function deleteJob(jobId) {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/job/${jobId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Job deleted successfully');
        setSuccessMessage('Job deleted successfully');
        fetchJobs();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setErrorMessage(
        error.message || 'An error occurred while deleting the job.'
      );
      setTimeLeft(10);
      setTimeout(() => {
        setErrorMessage('');
        setTimeLeft(0);
      }, 10000);
    }
  }

  const updateJob = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/v1/job/${jobToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Job updated:', data);
        setSuccessMessage('Job updated successfully');
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
        setJobToUpdate(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setErrorMessage(error.message || 'An error occurred while updating the job.');
      setTimeLeft(10);
      setTimeout(() => {
        setErrorMessage('');
        setTimeLeft(0);
      }, 10000);
    }
  };

  const handleUpdateClick = (job) => {
    setJobData({
      role: job.role,
      seniority: job.seniority,
      companyName: job.companyName,
      date: job.date,
      salary: job.salary,
      city: job.city,
      workType: job.workType,
    });
    setJobToUpdate(job);
    setShowPopup(true);
  };

  return (
    <div>
      <h1>Job List</h1>
      <div className="button-container">
        <button onClick={() => setShowPopup(true)}>Add Job</button>
      </div>
      <div className='success-message'>
              {successMessage}
            </div>
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
            <th>Actions</th>
          </tr>
        </thead>
        {Array.isArray(jobs) && jobs.length > 0 ? (
  <tbody>
    {jobs.map((job) => (
      <tr key={job.id}>
        <td>{job.id}</td>
        <td>{job.role}</td>
        <td>{job.city}</td>
        <td>{job.companyName}</td>
        <td>
          {new Date(job.date).toLocaleDateString()}{' '}
          {new Date(job.date).toLocaleTimeString()}
        </td>
        <td>{job.salary}</td>
        <td>{job.seniority}</td>
        <td>{job.workType}</td>
        <td>
          <button className='delete-button'
            onClick={() => deleteJob(job.id)}
          >
            Delete
          </button>
          <button className='update-button' onClick={() => handleUpdateClick(job)}>Update</button>
        </td>
      </tr>
    ))}
  </tbody>
) : (
  <tbody >
    <tr>
      <td colSpan="9"  style={{ textAlign: 'center' }}>No jobs found.</td>
    </tr>
  </tbody>
)}
      </table>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>{jobToUpdate ? 'Update Job' : 'Add Job'}</h2>
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
                <span className='timer-error-message'>{timeLeft > 0 && timeLeft}s</span>
              </div>
            )}
            <form onSubmit={jobToUpdate ? updateJob : addJob}>
              <label>
                Role:
                <input
                  type="text"
                  name="role"
                  value={jobData.role}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Seniority:
                <select
                  name="seniority"
                  value={jobData.seniority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Seniority</option>
                  <option value="INTERN">Intern</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior</option>
                </select>
              </label>
              <label>
                Company Name:
                <input
                  type="text"
                  name="companyName"
                  value={jobData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Date:
                <input
                  type="datetime-local"
                  name="date"
                  value={jobData.date}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Salary:
                <input
                  type="number"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={jobData.city}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Work Type:
                <select
                  name="workType"
                  value={jobData.workType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Work Type</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </label>
              <button type="submit">{jobToUpdate ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobList;
