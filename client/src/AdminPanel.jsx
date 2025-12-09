import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ---------------------------------------------------------
// 🔴 LIVE BACKEND CONNECTION
// ---------------------------------------------------------
const API_BASE = "https://realestateassignment.onrender.com"; 
// ---------------------------------------------------------

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState({ projects: 0, clients: 0, inquiries: 0, subs: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [clientsList, setClientsList] = useState([]);

  // Form States
  const [projData, setProjData] = useState({ name: '', description: '', image: null });
  const [clientData, setClientData] = useState({ name: '', designation: '', description: '', image: null });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const p = await axios.get(`${API_BASE}/projects`);
      const c = await axios.get(`${API_BASE}/clients`);
      const i = await axios.get(`${API_BASE}/contact`);
      const s = await axios.get(`${API_BASE}/subscribe`);
      
      setStats({ projects: p.data.length, clients: c.data.length, inquiries: i.data.length, subs: s.data.length });
      setInquiries(i.data);
      setSubscribers(s.data);
      setRecentProjects(p.data); 
      setClientsList(c.data);
    } catch (err) {
      console.log("Server offline or loading...");
    }
  };

  const handleUpload = async (type) => {
    const formData = new FormData();
    try {
        if(type === 'project') {
            formData.append('name', projData.name);
            formData.append('description', projData.description);
            formData.append('image', projData.image);
            await axios.post(`${API_BASE}/projects`, formData);
        } else {
            formData.append('name', clientData.name);
            formData.append('designation', clientData.designation);
            formData.append('description', clientData.description);
            formData.append('image', clientData.image);
            await axios.post(`${API_BASE}/clients`, formData);
        }
        alert("Saved Successfully!");
        refreshData();
    } catch (e) { alert("Error uploading. Check server connection."); }
  };

  // *** DELETE FUNCTION ***
  const handleDelete = async (id, type) => {
      if(!window.confirm("Delete this item?")) return;
      try {
          await axios.delete(`${API_BASE}/${type}/${id}`);
          refreshData();
      } catch (e) { alert("Error deleting item."); }
  };

  // --- COMPONENTS ---
  const SidebarItem = ({ id, icon, label }) => (
    <div 
        onClick={() => setActiveTab(id)}
        className={`d-flex align-items-center px-4 py-3 mb-1 text-white`}
        style={{ 
            cursor: 'pointer', 
            transition: 'all 0.3s', 
            background: activeTab === id ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === id ? '4px solid #00aaff' : '4px solid transparent',
            width: '100%'
        }}
    >
        <i className={`bi ${icon} me-3 fs-5`} style={{color: activeTab === id ? '#00aaff' : 'rgba(255,255,255,0.7)'}}></i>
        <span style={{ fontWeight: '500', letterSpacing: '0.5px', fontSize: '0.95rem' }}>{label}</span>
    </div>
  );

  const StatCard = ({ title, count, icon, gradient }) => (
    <Card className="border-0 text-white h-100 shadow-sm" style={{ background: gradient, borderRadius: '12px' }}>
        <Card.Body className="d-flex align-items-center justify-content-between p-4">
            <div>
                <h6 className="text-white-50 text-uppercase fw-bold mb-1" style={{fontSize:'0.75rem'}}>{title}</h6>
                <h2 className="fw-bold mb-0 display-6">{count}</h2>
            </div>
            <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`bi ${icon} fs-3`}></i>
            </div>
        </Card.Body>
    </Card>
  );

  return (
    // MAIN WRAPPER: FLEXBOX LAYOUT
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Poppins', sans-serif", overflowX: 'hidden' }}>
      
      {/* 1. SIDEBAR (Fixed Width, Flex Shrink 0) */}
      <div style={{ width: '280px', background: '#0e2e50', minHeight: '100vh', flexShrink: 0, zIndex: 1000 }} className="d-flex flex-column py-4 shadow">
        <div className="px-4 mb-5">
            {/* UPDATED NAME HERE */}
            <h4 className="fw-bold text-white m-0 d-flex align-items-center">
                <i className="bi bi-house-heart-fill me-2 text-primary"></i>
                Dream<span style={{color: '#00aaff'}}>Home</span>
            </h4>
            <small className="text-white-50 ms-4 ps-1" style={{fontSize:'0.65rem'}}>ADMIN DASHBOARD</small>
        </div>
        <nav className="flex-grow-1 w-100">
            <small className="text-white-50 px-4 mb-2 d-block fw-bold" style={{fontSize:'0.7rem'}}>ANALYTICS</small>
            <SidebarItem id="dashboard" icon="bi-grid-1x2-fill" label="Overview" />
            <div className="my-3"></div>
            <small className="text-white-50 px-4 mb-2 d-block fw-bold" style={{fontSize:'0.7rem'}}>MANAGEMENT</small>
            <SidebarItem id="inquiries" icon="bi-chat-left-dots-fill" label="Inquiries" />
            <SidebarItem id="subscribers" icon="bi-people-fill" label="Subscribers" />
            <SidebarItem id="add_project" icon="bi-building-add" label="Add Project" />
            <SidebarItem id="add_client" icon="bi-person-plus-fill" label="Add Client" />
        </nav>
        <div className="px-3 mt-auto">
            <Link to="/">
                <Button variant="outline-light" className="w-100 fw-bold py-2" style={{borderRadius: '8px', border:'1px solid rgba(255,255,255,0.1)'}}>
                   Website
                </Button>
            </Link>
        </div>
      </div>

      {/* 2. MAIN CONTENT (Flex Grow 1) */}
      <div style={{ flexGrow: 1, padding: '30px', background: '#f0f2f5', minHeight: '100vh', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 w-100">
            <h3 className="fw-bold text-dark m-0" style={{textTransform: 'capitalize'}}>{activeTab.replace('_', ' ')}</h3>
            <div className="d-flex align-items-center bg-white px-3 py-2 rounded shadow-sm">
                 <div style={{width:'8px', height:'8px', background:'#28a745', borderRadius:'50%', marginRight:'8px'}}></div>
                 <small className="fw-bold text-muted">System Online</small>
            </div>
        </div>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
            <div className="fade-in w-100">
                <Row className="g-4 mb-4">
                    <Col xl={3} md={6} sm={12}><StatCard title="Projects" count={stats.projects} icon="bi-building" gradient="linear-gradient(45deg, #4099ff, #73b4ff)" /></Col>
                    <Col xl={3} md={6} sm={12}><StatCard title="Clients" count={stats.clients} icon="bi-emoji-smile" gradient="linear-gradient(45deg, #2ed8b6, #59e0c5)" /></Col>
                    <Col xl={3} md={6} sm={12}><StatCard title="Inquiries" count={stats.inquiries} icon="bi-envelope" gradient="linear-gradient(45deg, #FFB64D, #ffcb80)" /></Col>
                    <Col xl={3} md={6} sm={12}><StatCard title="Subscribers" count={stats.subs} icon="bi-bell" gradient="linear-gradient(45deg, #FF5370, #ff869a)" /></Col>
                </Row>

                <Row className="g-4">
                    <Col lg={12} md={12}>
                        <Card className="border-0 shadow-sm p-0 h-100 w-100" style={{borderRadius: '12px', overflow:'hidden'}}>
                            <Card.Header className="bg-white py-3 px-4 fw-bold border-bottom">Manage Projects</Card.Header>
                            <Table hover className="mb-0 align-middle w-100">
                                <thead className="bg-light text-muted small"><tr><th className="ps-4">PROJECT</th><th>DETAILS</th><th>STATUS</th><th>ACTION</th></tr></thead>
                                <tbody>
                                    {recentProjects.map((p,i) => (
                                        <tr key={i}>
                                            <td className="ps-4 fw-bold"><img src={p.image} className="rounded me-2" width="40" height="40" style={{objectFit:'cover'}}/> {p.name}</td>
                                            <td className="text-muted small">{p.description}</td>
                                            <td><Badge bg="success" className="px-2">Active</Badge></td>
                                            <td>
                                                <Button size="sm" variant="outline-danger" onClick={()=>handleDelete(p._id, 'projects')}><i className="bi bi-trash"></i></Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentProjects.length===0 && <tr><td colSpan="4" className="p-4 text-center text-muted">No projects available.</td></tr>}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </div>
        )}

        {/* --- INQUIRIES TAB --- */}
        {activeTab === 'inquiries' && (
            <Card className="border-0 shadow-sm w-100" style={{borderRadius: '12px'}}>
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white" style={{borderRadius: '12px 12px 0 0'}}>
                    <h5 className="fw-bold m-0 ps-2">All Inquiries</h5>
                    <Button variant="outline-primary" size="sm"><i className="bi bi-download me-2"></i>Export</Button>
                </div>
                <Table hover responsive className="mb-0 align-middle w-100">
                    <thead className="bg-light text-muted small">
                        <tr>
                            <th className="py-3 ps-4">NAME</th>
                            <th>CONTACT</th>
                            <th>LOCATION</th>
                            <th className="text-end pe-4">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.map((inq, i) => (
                            <tr key={i}>
                                <td className="ps-4 fw-bold">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center me-3 fw-bold" style={{width:'35px', height:'35px'}}>
                                            {inq.fullName ? inq.fullName.charAt(0) : 'U'}
                                        </div>
                                        {inq.fullName}
                                    </div>
                                </td>
                                <td>
                                    <div className="small text-dark">{inq.email}</div>
                                    <div className="small text-muted">{inq.mobile}</div>
                                </td>
                                <td><Badge bg="light" text="dark" className="border">{inq.city}</Badge></td>
                                <td className="text-end pe-4">
                                    <Button size="sm" variant="light" className="text-danger"><i className="bi bi-trash"></i></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        )}

        {/* --- ADD PROJECT --- */}
        {activeTab === 'add_project' && (
            <Card className="border-0 shadow-sm w-100" style={{borderRadius: '12px', overflow:'hidden'}}>
                <Card.Header className="bg-white py-3 px-4 fw-bold border-bottom text-primary">Add New Property</Card.Header>
                <Card.Body className="p-0">
                    <Row className="g-0 w-100 m-0">
                        <Col lg={8} md={12} className="p-5 border-end">
                             <Row className="g-3">
                                 <Col md={12}>
                                    <Form.Label className="small fw-bold text-muted">PROPERTY TITLE</Form.Label>
                                    <Form.Control size="lg" placeholder="e.g. Luxury Apartment" style={{fontSize:'0.9rem'}} onChange={e=>setProjData({...projData, name:e.target.value})}/>
                                 </Col>
                                 <Col md={12}>
                                    <Form.Label className="small fw-bold text-muted">DESCRIPTION / ADDRESS</Form.Label>
                                    <Form.Control as="textarea" rows={6} placeholder="Detailed description..." style={{fontSize:'0.9rem'}} onChange={e=>setProjData({...projData, description:e.target.value})}/>
                                 </Col>
                             </Row>
                        </Col>
                        <Col lg={4} md={12} className="p-5 bg-light d-flex flex-column justify-content-center text-center">
                             <div className="mb-4">
                                <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center mx-auto mb-3" style={{width:'80px', height:'80px'}}>
                                    <i className="bi bi-image fs-2 text-muted"></i>
                                </div>
                                <h6 className="fw-bold">Upload Cover Image</h6>
                                <p className="text-muted small">Supports JPG, PNG</p>
                                <Form.Control type="file" size="sm" className="w-75 mx-auto" onChange={e=>setProjData({...projData, image:e.target.files[0]})} />
                             </div>
                             <Button className="w-100 fw-bold py-3 mt-auto" style={{background:'#0e2e50'}} onClick={()=>handleUpload('project')}>
                                PUBLISH PROPERTY
                             </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )}

        {/* --- ADD CLIENT --- */}
        {activeTab === 'add_client' && (
             <Card className="border-0 shadow-sm w-100" style={{borderRadius: '12px', overflow:'hidden'}}>
                <Card.Header className="bg-white py-3 px-4 fw-bold border-bottom text-warning">Add Testimonial</Card.Header>
                <Card.Body className="p-0">
                    <Row className="g-0 w-100 m-0">
                        <Col lg={8} md={12} className="p-5 border-end">
                             <Row className="g-3">
                                 <Col md={6}>
                                    <Form.Label className="small fw-bold text-muted">CLIENT NAME</Form.Label>
                                    <Form.Control size="lg" placeholder="Name" style={{fontSize:'0.9rem'}} onChange={e=>setClientData({...clientData, name:e.target.value})}/>
                                 </Col>
                                 <Col md={6}>
                                    <Form.Label className="small fw-bold text-muted">DESIGNATION</Form.Label>
                                    <Form.Control size="lg" placeholder="Role / Company" style={{fontSize:'0.9rem'}} onChange={e=>setClientData({...clientData, designation:e.target.value})}/>
                                 </Col>
                                 <Col md={12}>
                                    <Form.Label className="small fw-bold text-muted">TESTIMONIAL</Form.Label>
                                    <Form.Control as="textarea" rows={5} placeholder="Quote..." style={{fontSize:'0.9rem'}} onChange={e=>setClientData({...clientData, description:e.target.value})}/>
                                 </Col>
                             </Row>
                        </Col>
                        <Col lg={4} md={12} className="p-5 bg-light d-flex flex-column justify-content-center text-center">
                             <div className="mb-4">
                                <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center mx-auto mb-3" style={{width:'80px', height:'80px'}}>
                                    <i className="bi bi-person fs-2 text-muted"></i>
                                </div>
                                <h6 className="fw-bold">Client Photo</h6>
                                <Form.Control type="file" size="sm" className="w-75 mx-auto" onChange={e=>setClientData({...clientData, image:e.target.files[0]})} />
                             </div>
                             <Button className="w-100 fw-bold py-3 mt-auto" style={{background:'#f05a28', border:'none'}} onClick={()=>handleUpload('client')}>
                                SAVE TESTIMONIAL
                             </Button>
                        </Col>
                    </Row>
                </Card.Body>
                {/* LIST OF CLIENTS FOR DELETION */}
                <Card.Footer className="bg-white p-3">
                    <small className="fw-bold text-muted">Manage Clients</small>
                    <Table size="sm" className="mt-2 mb-0">
                        <tbody>
                            {clientsList.map((c,i) => (
                                <tr key={i}>
                                    <td>{c.name}</td>
                                    <td>{c.designation}</td>
                                    <td className="text-end"><Button size="sm" variant="link" className="text-danger p-0" onClick={()=>handleDelete(c._id, 'clients')}>Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Footer>
            </Card>
        )}

        {/* --- SUBSCRIBERS TAB (Full Width) --- */}
        {activeTab === 'subscribers' && (
            <Card className="border-0 shadow-sm w-100" style={{borderRadius: '12px'}}>
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                    <h5 className="fw-bold m-0 ps-2">Newsletter List</h5>
                    <Badge bg="info">{stats.subs} Subscribers</Badge>
                </div>
                <Table striped hover className="mb-0 align-middle w-100">
                    <thead className="bg-light text-muted small"><tr><th className="py-3 ps-4">EMAIL</th><th className="text-end pe-4">SOURCE</th></tr></thead>
                    <tbody>
                        {subscribers.map((s, i) => (
                            <tr key={i}>
                                <td className="ps-4 fw-bold py-3"><i className="bi bi-envelope-check-fill me-2 text-success"></i> {s.email}</td>
                                <td className="text-end pe-4 text-muted small">Web Form</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;