import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, Modal, InputGroup, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const API_BASE = "https://realestateassignment.onrender.com"; 

// --- DUMMY DATA ---
const DUMMY_INQUIRIES = [
    { _id: '1', fullName: 'Alice Johnson', email: 'alice@example.com', mobile: '555-0101', city: 'New York', status: 'New' },
    { _id: '2', fullName: 'Bob Smith', email: 'bob@test.com', mobile: '555-0102', city: 'Los Angeles', status: 'Pending' }
];
const DUMMY_SUBS = [
    { email: "subscriber1@gmail.com", date: "2023-12-01" },
    { email: "realestate@fan.com", date: "2023-12-10" }
];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight), mediaWidth, mediaHeight)
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false); // Mobile Sidebar State
  
  // Data States
  const [stats, setStats] = useState({ projects: 0, clients: 0, inquiries: 0, subs: 0 });
  const [inquiries, setInquiries] = useState(DUMMY_INQUIRIES);
  const [subscribers, setSubscribers] = useState(DUMMY_SUBS);
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
      
      setStats({ projects: p.data.length, clients: c.data.length, inquiries: i.data.length, subs: s.data.length });
      if (i.data.length > 0) setInquiries(i.data);
      if (s.data.length > 0) setSubscribers(s.data);
      setRecentProjects(p.data); 
      setClientsList(c.data);
    } catch (err) { console.log("Server loading..."); }
  };

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

  // --- REUSABLE SIDEBAR CONTENT ---
  const SidebarContent = () => (
    <div className="d-flex flex-column h-100 py-4" style={{background: '#0e2e50'}}>
        <div className="px-4 mb-5">
            <h4 className="fw-bold text-white m-0 d-flex align-items-center">
                <i className="bi bi-house-heart-fill me-2 text-primary"></i>
                Dream<span style={{color: '#00aaff'}}>Home</span>
            </h4>
            <small className="text-white-50 ms-4 ps-1" style={{fontSize:'0.65rem'}}>ADMIN DASHBOARD</small>
        </div>
        <nav className="flex-grow-1 w-100">
            {[
                {id: 'dashboard', i: 'bi-grid-1x2-fill', l: 'Overview'},
                {id: 'inquiries', i: 'bi-chat-left-dots-fill', l: 'Inquiries'},
                {id: 'subscribers', i: 'bi-people-fill', l: 'Subscribers'},
                {id: 'add_project', i: 'bi-building-add', l: 'Add Project'},
                {id: 'add_client', i: 'bi-person-plus-fill', l: 'Add Client'}
            ].map(item => (
                <div key={item.id} onClick={() => { setActiveTab(item.id); setShowMobileSidebar(false); }} 
                    className={`d-flex align-items-center px-4 py-3 mb-1 text-white`} 
                    style={{ cursor: 'pointer', transition: 'all 0.3s', background: activeTab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent', borderLeft: activeTab === item.id ? '4px solid #00aaff' : '4px solid transparent' }}>
                    <i className={`bi ${item.i} me-3 fs-5`} style={{color: activeTab === item.id ? '#00aaff' : 'rgba(255,255,255,0.7)'}}></i>
                    <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{item.l}</span>
                </div>
            ))}
        </nav>
        <div className="px-3 mt-auto"><Link to="/"><Button variant="outline-light" className="w-100 fw-bold py-2">Go to Website</Button></Link></div>
    </div>
  );

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* 1. DESKTOP SIDEBAR (Hidden on Mobile) */}
      <div className="d-none d-lg-block shadow" style={{ width: '280px', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1000 }}>
        <SidebarContent />
      </div>

      {/* 2. MOBILE SIDEBAR (Offcanvas) */}
      <Offcanvas show={showMobileSidebar} onHide={() => setShowMobileSidebar(false)} style={{width: '280px', background: '#0e2e50', border: 'none'}}>
        <Offcanvas.Body className="p-0">
            <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>

      {/* 3. MAIN CONTENT (Adjusted margin for responsive) */}
      <div style={{ flexGrow: 1, marginLeft: '0', padding: '20px', width: '100%', transition: 'margin-left 0.3s' }} className="ms-lg-auto">
        
        {/* RESPONSIVE HEADER with Menu Button */}
        <div className="d-flex justify-content-between align-items-center mb-4 pt-2" style={{ marginLeft: window.innerWidth > 992 ? '280px' : '0' }}>
            <div className="d-flex align-items-center">
                <Button variant="outline-dark" className="d-lg-none me-3 border-0" onClick={() => setShowMobileSidebar(true)}>
                    <i className="bi bi-list fs-1"></i>
                </Button>
                <h3 className="fw-bold text-dark m-0" style={{textTransform: 'capitalize'}}>{activeTab.replace('_', ' ')}</h3>
            </div>
            <div className="d-none d-md-flex align-items-center bg-white px-3 py-2 rounded shadow-sm">
                 <div style={{width:'8px', height:'8px', background:'#28a745', borderRadius:'50%', marginRight:'8px'}}></div>
                 <small className="fw-bold text-muted">Online</small>
            </div>
        </div>

        {/* CONTENT WRAPPER (Pushes content right on Desktop) */}
        <div style={{ marginLeft: window.innerWidth > 992 ? '280px' : '0' }}>
            
            {activeTab === 'dashboard' && (
                <Row className="g-3 g-md-4">
                    <Col xs={12} sm={6} xl={3}><Card className="p-3 p-md-4 border-0 shadow-sm"><h3 className="fw-bold">{stats.projects}</h3><small>Projects</small></Card></Col>
                    <Col xs={12} sm={6} xl={3}><Card className="p-3 p-md-4 border-0 shadow-sm"><h3 className="fw-bold">{stats.clients}</h3><small>Clients</small></Card></Col>
                    <Col xs={12} sm={6} xl={3}><Card className="p-3 p-md-4 border-0 shadow-sm"><h3 className="fw-bold">{stats.inquiries}</h3><small>Inquiries</small></Card></Col>
                    <Col xs={12} sm={6} xl={3}><Card className="p-3 p-md-4 border-0 shadow-sm"><h3 className="fw-bold">{stats.subs}</h3><small>Subscribers</small></Card></Col>
                    <Col xs={12}>
                        <Card className="border-0 shadow-sm p-0 overflow-hidden">
                            <Card.Header className="bg-white fw-bold py-3">Recent Projects</Card.Header>
                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle text-nowrap">
                                    <tbody>{recentProjects.map((p,i) => <tr key={i}><td><img src={p.image} width="40" className="rounded me-2"/>{p.name}</td><td className="text-end"><Button size="sm" variant="danger" onClick={()=>handleDelete(p._id, 'projects')}><i className="bi bi-trash"></i></Button></td></tr>)}</tbody>
                                </Table>
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}

            {activeTab === 'inquiries' && (
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white p-3"><h5 className="mb-0 fw-bold">Leads</h5></Card.Header>
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0 text-nowrap">
                            <thead className="bg-light"><tr><th className="ps-3">Profile</th><th>Contact</th><th>City</th><th>Action</th></tr></thead>
                            <tbody>{inquiries.map((x,i)=><tr key={i}><td className="ps-3 fw-bold">{x.fullName}</td><td>{x.email}<br/><small className="text-muted">{x.mobile}</small></td><td>{x.city}</td><td><Button size="sm" variant="outline-danger" onClick={()=>handleDelete(x._id, 'contact')}><i className="bi bi-trash"></i></Button></td></tr>)}</tbody>
                        </Table>
                    </div>
                </Card>
            )}

            {activeTab === 'subscribers' && (
                <Card className="border-0 shadow-sm">
                    <div className="table-responsive">
                        <Table striped hover className="align-middle mb-0 text-nowrap">
                            <tbody>{subscribers.map((x,i)=><tr key={i}><td className="p-3">{x.email}</td><td><Badge bg="success">Active</Badge></td></tr>)}</tbody>
                        </Table>
                    </div>
                </Card>
            )}

            {(activeTab === 'add_project' || activeTab === 'add_client') && (
                <Card className="border-0 shadow-sm p-4 p-md-5">
                    <h5 className="mb-4 text-primary">{activeTab === 'add_project' ? 'Add Property' : 'Add Testimonial'}</h5>
                    <Row className="g-4">
                        <Col lg={8}>
                            {activeTab==='add_project' ? 
                                <><Form.Control placeholder="Title" className="mb-3" onChange={e=>setProjData({...projData, name:e.target.value})}/><Form.Control as="textarea" rows={5} placeholder="Desc" onChange={e=>setProjData({...projData, description:e.target.value})}/></> :
                                <><Row><Col><Form.Control placeholder="Name" className="mb-3" onChange={e=>setClientData({...clientData, name:e.target.value})}/></Col><Col><Form.Control placeholder="Role" className="mb-3" onChange={e=>setClientData({...clientData, designation:e.target.value})}/></Col></Row><Form.Control as="textarea" rows={5} placeholder="Quote" onChange={e=>setClientData({...clientData, description:e.target.value})}/></>
                            }
                        </Col>
                        <Col lg={4} className="text-center">
                            <div className="mb-3 p-4 bg-light border rounded">{(activeTab==='add_project'?projData.image:clientData.image) ? <span className="text-success fw-bold">Image Ready</span> : <span className="text-muted">Select Image</span>}</div>
                            <Form.Control type="file" onChange={(e) => onSelectFile(e, activeTab === 'add_project' ? 'project' : 'client')} />
                            <Button className="w-100 mt-3 fw-bold" style={{background:'#0e2e50'}} onClick={()=>handleUpload(activeTab === 'add_project' ? 'project' : 'client')}>PUBLISH</Button>
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
      </div>

      <Modal show={showCropModal} onHide={() => setShowCropModal(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Crop Image</Modal.Title></Modal.Header>
        <Modal.Body className="text-center bg-dark text-white p-0" style={{minHeight:'300px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {!!imgSrc && (<ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={uploadType === 'project' ? 450/350 : 1}><img ref={imgRef} src={imgSrc} onLoad={onImageLoad} style={{ maxWidth: '100%', maxHeight: '60vh' }} /></ReactCrop>)}
        </Modal.Body>
        <Modal.Footer><Button onClick={handleCropSave}>Crop & Save</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;