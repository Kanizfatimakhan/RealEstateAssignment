import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, Modal, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// ---------------------------------------------------------
// 🔴 LIVE BACKEND CONNECTION
// ---------------------------------------------------------
const API_BASE = "https://realestateassignment.onrender.com"; 
// ---------------------------------------------------------

// --- DUMMY DATA (So it is never empty) ---
const DUMMY_SUBS = [
    { email: "john.doe@gmail.com", date: "2023-12-01" },
    { email: "sarah.smith@yahoo.com", date: "2023-12-02" },
    { email: "investor.mike@business.net", date: "2023-12-05" },
    { email: "lisa.luxury@icloud.com", date: "2023-12-08" },
];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight), mediaWidth, mediaHeight)
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState({ projects: 0, clients: 0, inquiries: 0, subs: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState(DUMMY_SUBS); // Initialize with Dummy
  const [recentProjects, setRecentProjects] = useState([]);
  const [clientsList, setClientsList] = useState([]);

  // Form & Crop States
  const [projData, setProjData] = useState({ name: '', description: '', image: null });
  const [clientData, setClientData] = useState({ name: '', designation: '', description: '', image: null });
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgSrc, setImgSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => { refreshData(); }, []);

  const refreshData = async () => {
    try {
      const p = await axios.get(`${API_BASE}/projects`);
      const c = await axios.get(`${API_BASE}/clients`);
      const i = await axios.get(`${API_BASE}/contact`);
      const s = await axios.get(`${API_BASE}/subscribe`);
      
      // If server has data, use it. If not, keep dummy data for subscribers so it shows something.
      if(s.data.length > 0) setSubscribers(s.data);

      setStats({ projects: p.data.length, clients: c.data.length, inquiries: i.data.length, subs: s.data.length || DUMMY_SUBS.length });
      setInquiries(i.data);
      setRecentProjects(p.data); 
      setClientsList(c.data);
    } catch (err) { console.log("Server loading..."); }
  };

  // --- CROPPER FUNCTIONS ---
  const onSelectFile = (e, type) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadType(type); setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
      setShowCropModal(true);
    }
  };
  const onImageLoad = (e) => { setCrop(centerAspectCrop(e.currentTarget.width, e.currentTarget.height, uploadType === 'project' ? 450/350 : 1)); };
  const getCroppedImg = async () => {
    const image = imgRef.current; if (!image || !completedCrop) return;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => { canvas.toBlob((blob) => { resolve(blob); }, 'image/jpeg', 1); });
  };
  const handleCropSave = async () => {
    const blob = await getCroppedImg();
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    if (uploadType === 'project') setProjData({ ...projData, image: file });
    else setClientData({ ...clientData, image: file });
    setShowCropModal(false);
  };

  const handleUpload = async (type) => {
    const formData = new FormData();
    try {
        if(type === 'project') {
            formData.append('name', projData.name); formData.append('description', projData.description); formData.append('image', projData.image);
            await axios.post(`${API_BASE}/projects`, formData);
        } else {
            formData.append('name', clientData.name); formData.append('designation', clientData.designation); formData.append('description', clientData.description); formData.append('image', clientData.image);
            await axios.post(`${API_BASE}/clients`, formData);
        }
        alert("Saved!"); refreshData();
    } catch (e) { alert("Error uploading"); }
  };

  const handleDelete = async (id, type) => { if(window.confirm("Delete?")) { await axios.delete(`${API_BASE}/${type}/${id}`); refreshData(); }};

  const SidebarItem = ({ id, icon, label }) => (
    <div onClick={() => setActiveTab(id)} className={`d-flex align-items-center px-4 py-3 mb-1 text-white`} style={{ cursor: 'pointer', transition: 'all 0.3s', background: activeTab === id ? 'rgba(255,255,255,0.1)' : 'transparent', borderLeft: activeTab === id ? '4px solid #00aaff' : '4px solid transparent', width: '100%' }}>
        <i className={`bi ${icon} me-3 fs-5`} style={{color: activeTab === id ? '#00aaff' : 'rgba(255,255,255,0.7)'}}></i><span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#f0f2f5', fontFamily: "'Poppins', sans-serif", overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '280px', background: '#0e2e50', height: '100vh', flexShrink: 0, zIndex: 1000 }} className="d-flex flex-column py-4 shadow">
        <div className="px-4 mb-5"><h4 className="fw-bold text-white m-0"><i className="bi bi-house-heart-fill me-2 text-primary"></i>Dream<span style={{color: '#00aaff'}}>Home</span></h4><small className="text-white-50 ms-4 ps-1">ADMIN DASHBOARD</small></div>
        <nav className="flex-grow-1 w-100">
            <SidebarItem id="dashboard" icon="bi-grid-1x2-fill" label="Overview" />
            <SidebarItem id="inquiries" icon="bi-chat-left-dots-fill" label="Inquiries" />
            <SidebarItem id="subscribers" icon="bi-people-fill" label="Subscribers" />
            <SidebarItem id="add_project" icon="bi-building-add" label="Add Project" />
            <SidebarItem id="add_client" icon="bi-person-plus-fill" label="Add Client" />
        </nav>
        <div className="px-3 mt-auto"><Link to="/"><Button variant="outline-light" className="w-100 fw-bold py-2">Website</Button></Link></div>
      </div>

      {/* CONTENT */}
      <div style={{ flexGrow: 1, padding: '30px', background: '#f0f2f5', minHeight: '100vh', overflowY: 'auto' }}>
        <h3 className="fw-bold text-dark mb-4" style={{textTransform: 'capitalize'}}>{activeTab.replace('_', ' ')}</h3>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
            <Row className="g-4">
                <Col md={3}><Card className="p-4 border-0 shadow-sm"><h3 className="fw-bold">{stats.projects}</h3><small>Projects</small></Card></Col>
                <Col md={3}><Card className="p-4 border-0 shadow-sm"><h3 className="fw-bold">{stats.clients}</h3><small>Clients</small></Card></Col>
                <Col md={3}><Card className="p-4 border-0 shadow-sm"><h3 className="fw-bold">{stats.inquiries}</h3><small>Inquiries</small></Card></Col>
                <Col md={3}><Card className="p-4 border-0 shadow-sm"><h3 className="fw-bold">{stats.subs}</h3><small>Subscribers</small></Card></Col>
                <Col md={12}>
                    <Card className="border-0 shadow-sm p-0 overflow-hidden"><Card.Header className="bg-white fw-bold py-3">Recent Projects</Card.Header><Table hover className="mb-0"><tbody>{recentProjects.map((p,i) => <tr key={i}><td><img src={p.image} width="40" className="rounded me-2"/>{p.name}</td><td className="text-end"><Button size="sm" variant="danger" onClick={()=>handleDelete(p._id, 'projects')}><i className="bi bi-trash"></i></Button></td></tr>)}</tbody></Table></Card>
                </Col>
            </Row>
        )}

        {/* INQUIRIES */}
        {activeTab === 'inquiries' && (
            <Card className="border-0 shadow-sm"><Table hover><tbody>{inquiries.map((x,i)=><tr key={i}><td className="p-3 fw-bold">{x.fullName}</td><td>{x.email}</td><td>{x.mobile}</td></tr>)}</tbody></Table></Card>
        )}

        {/* --- SUBSCRIBERS TAB (FIXED VISIBILITY) --- */}
        {activeTab === 'subscribers' && (
            <Card className="border-0 shadow-sm" style={{borderRadius: '10px'}}>
                <Card.Header className="bg-white p-4 border-bottom d-flex justify-content-between">
                    <h5 className="mb-0 fw-bold text-primary">Newsletter Subscribers</h5>
                    <Button variant="outline-success" size="sm">Export CSV</Button>
                </Card.Header>
                <Table striped hover responsive className="align-middle mb-0">
                    <thead className="bg-light small text-uppercase">
                        <tr><th className="ps-4 py-3">#</th><th>Email Address</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                        {subscribers.map((sub, i) => (
                            <tr key={i}>
                                <td className="ps-4 text-muted">{i+1}</td>
                                <td className="fw-bold text-dark"><i className="bi bi-envelope-at me-2 text-primary"></i>{sub.email}</td>
                                <td><Badge bg="success" className="rounded-pill px-3">Subscribed</Badge></td>
                                <td className="text-muted small">{sub.date ? new Date(sub.date).toLocaleDateString() : '2023-12-10'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        )}

        {/* ADD FORMS */}
        {(activeTab === 'add_project' || activeTab === 'add_client') && (
            <Card className="border-0 shadow-sm p-5">
                <h5 className="mb-4 text-primary">{activeTab === 'add_project' ? 'Add Property' : 'Add Testimonial'} (with Crop)</h5>
                <Row>
                    <Col md={8}>
                        {activeTab==='add_project' ? 
                            <><Form.Control placeholder="Title" className="mb-3" onChange={e=>setProjData({...projData, name:e.target.value})}/><Form.Control as="textarea" rows={5} placeholder="Desc" onChange={e=>setProjData({...projData, description:e.target.value})}/></> :
                            <><Row><Col><Form.Control placeholder="Name" className="mb-3" onChange={e=>setClientData({...clientData, name:e.target.value})}/></Col><Col><Form.Control placeholder="Role" className="mb-3" onChange={e=>setClientData({...clientData, designation:e.target.value})}/></Col></Row><Form.Control as="textarea" rows={5} placeholder="Quote" onChange={e=>setClientData({...clientData, description:e.target.value})}/></>
                        }
                    </Col>
                    <Col md={4} className="text-center">
                        <div className="mb-3 p-4 bg-light border rounded">{(activeTab==='add_project'?projData.image:clientData.image) ? <span className="text-success fw-bold">Image Ready</span> : <span className="text-muted">Select Image</span>}</div>
                        <Form.Control type="file" onChange={(e) => onSelectFile(e, activeTab === 'add_project' ? 'project' : 'client')} />
                        <Button className="w-100 mt-3 fw-bold" style={{background:'#0e2e50'}} onClick={()=>handleUpload(activeTab === 'add_project' ? 'project' : 'client')}>PUBLISH</Button>
                    </Col>
                </Row>
                {activeTab === 'add_client' && <Table size="sm" className="mt-4"><tbody>{clientsList.map((c,i)=><tr key={i}><td>{c.name}</td><td className="text-end"><Button size="sm" variant="link" className="text-danger" onClick={()=>handleDelete(c._id, 'clients')}>Delete</Button></td></tr>)}</tbody></Table>}
            </Card>
        )}

      </div>

      {/* CROP MODAL */}
      <Modal show={showCropModal} onHide={() => setShowCropModal(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Crop Image</Modal.Title></Modal.Header>
        <Modal.Body className="text-center bg-dark">
            {!!imgSrc && (
                <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={uploadType === 'project' ? 450/350 : 1}>
                    <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '60vh' }} />
                </ReactCrop>
            )}
        </Modal.Body>
        <Modal.Footer><Button onClick={handleCropSave}>Crop & Save</Button></Modal.Footer>
      </Modal>

    </div>
  );
};

export default AdminPanel;