import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, Modal, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const API_BASE = "https://realestateassignment.onrender.com"; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Data
  const [stats, setStats] = useState({ projects: 0, clients: 0, inquiries: 0, subs: 0 });
  const [inquiries, setInquiries] = useState([{ fullName: 'Alice', email: 'alice@test.com', mobile: '123', city: 'NY' }]);
  const [subscribers, setSubscribers] = useState([{ email: 'sub@test.com' }]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [clientsList, setClientsList] = useState([]);

  // Forms & Cropper
  const [projData, setProjData] = useState({ name: '', description: '', image: null });
  const [clientData, setClientData] = useState({ name: '', designation: '', description: '', image: null });
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgSrc, setImgSrc] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const p = await axios.get(`${API_BASE}/projects`);
            const c = await axios.get(`${API_BASE}/clients`);
            const i = await axios.get(`${API_BASE}/contact`);
            const s = await axios.get(`${API_BASE}/subscribe`);
            setStats({ projects: p.data.length, clients: c.data.length, inquiries: i.data.length, subs: s.data.length });
            if(i.data.length) setInquiries(i.data);
            if(s.data.length) setSubscribers(s.data);
            setRecentProjects(p.data);
            setClientsList(c.data);
        } catch(e) {}
    };
    fetchData();
  }, []);

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100 text-white py-4" style={{background: '#0e2e50'}}>
        <div className="px-4 mb-5"><h4 className="fw-bold">Dream<span style={{color: '#00aaff'}}>Home</span></h4><small>ADMIN PANEL</small></div>
        <nav className="flex-grow-1">
            {['dashboard', 'inquiries', 'subscribers', 'add_project', 'add_client'].map(id => (
                <div key={id} onClick={() => {setActiveTab(id); setShowSidebar(false)}} className={`px-4 py-3 cursor-pointer ${activeTab===id?'bg-white bg-opacity-10 border-start border-4 border-info':''}`} style={{cursor:'pointer', textTransform:'capitalize'}}>
                    {id.replace('_', ' ')}
                </div>
            ))}
        </nav>
        <div className="px-4"><Link to="/"><Button variant="outline-light" className="w-100">Website</Button></Link></div>
    </div>
  );

  // --- CROPPER LOGIC ---
  const onSelectFile = (e, type) => { if (e.target.files?.length > 0) { setUploadType(type); setCrop(undefined); const r = new FileReader(); r.onload=()=>setImgSrc(r.result); r.readAsDataURL(e.target.files[0]); setShowCropModal(true); }};
  const handleCropSave = async () => {
      const img=imgRef.current; if(!img || !completedCrop) return;
      const cvs=document.createElement('canvas'); const scaleX=img.naturalWidth/img.width; const scaleY=img.naturalHeight/img.height;
      cvs.width=completedCrop.width*scaleX; cvs.height=completedCrop.height*scaleY;
      cvs.getContext('2d').drawImage(img, completedCrop.x*scaleX, completedCrop.y*scaleY, completedCrop.width*scaleX, completedCrop.height*scaleY, 0, 0, cvs.width, cvs.height);
      cvs.toBlob(b => { const f=new File([b],"crop.jpg",{type:"image/jpeg"}); if(uploadType==='project') setProjData({...projData, image:f}); else setClientData({...clientData, image:f}); setShowCropModal(false); }, 'image/jpeg');
  };
  const handleUpload = async (type) => {
      const fd = new FormData();
      if(type==='project') { fd.append('name',projData.name); fd.append('description',projData.description); fd.append('image',projData.image); await axios.post(`${API_BASE}/projects`, fd); }
      else { fd.append('name',clientData.name); fd.append('designation',clientData.designation); fd.append('description',clientData.description); fd.append('image',clientData.image); await axios.post(`${API_BASE}/clients`, fd); }
      alert("Saved!");
  };
  const handleDelete = async (id,t) => { if(window.confirm("Delete?")) await axios.delete(`${API_BASE}/${t}/${id}`); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'Poppins, sans-serif' }}>
        
        {/* DESKTOP SIDEBAR (FIXED WIDTH) */}
        <div className="d-none d-lg-block flex-shrink-0" style={{width:'280px'}}>
            <div style={{position:'fixed', width:'280px', height:'100%', top:0, left:0}}><SidebarContent /></div>
        </div>

        {/* MOBILE SIDEBAR (OFFCANVAS) */}
        <Offcanvas show={showSidebar} onHide={()=>setShowSidebar(false)} style={{width:'280px', background:'#0e2e50'}}><Offcanvas.Body className="p-0"><SidebarContent/></Offcanvas.Body></Offcanvas>

        {/* MAIN CONTENT (GROWS TO FILL SCREEN) */}
        <div className="flex-grow-1 p-3 p-md-4" style={{width: '100%', overflowX: 'hidden'}}>
            <div className="d-flex align-items-center mb-4">
                <Button variant="outline-dark" className="d-lg-none me-3" onClick={()=>setShowSidebar(true)}><i className="bi bi-list fs-4"></i></Button>
                <h3 className="m-0 fw-bold text-capitalize">{activeTab.replace('_', ' ')}</h3>
            </div>

            {activeTab === 'dashboard' && (
                <Row className="g-3">
                    {['Projects','Clients','Inquiries','Subs'].map((t,i) => <Col xs={6} md={3} key={i}><Card className="p-3 border-0 shadow-sm"><h3>{Object.values(stats)[i]}</h3><small>{t}</small></Card></Col>)}
                    <Col xs={12}><Card className="border-0 shadow-sm"><div className="table-responsive"><Table hover className="mb-0"><tbody>{recentProjects.map((p,i)=><tr key={i}><td>{p.name}</td><td className="text-end"><Button size="sm" variant="danger" onClick={()=>handleDelete(p._id,'projects')}>Del</Button></td></tr>)}</tbody></Table></div></Card></Col>
                </Row>
            )}

            {(activeTab === 'inquiries' || activeTab === 'subscribers') && (
                <Card className="border-0 shadow-sm">
                    <div className="table-responsive">
                        <Table hover className="mb-0 text-nowrap">
                            <thead className="bg-light"><tr><th>Name/Email</th>{activeTab==='inquiries' && <th>Mobile</th>}<th>Action</th></tr></thead>
                            <tbody>
                                {(activeTab==='inquiries'?inquiries:subscribers).map((x,i) => (
                                    <tr key={i}>
                                        <td>{x.fullName || x.email}</td>
                                        {activeTab==='inquiries' && <td>{x.mobile}</td>}
                                        <td><Badge bg="success">Active</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}

            {(activeTab === 'add_project' || activeTab === 'add_client') && (
                <Card className="border-0 shadow-sm p-4">
                    <Row className="g-3">
                        <Col md={8}>{activeTab==='add_project' ? <><Form.Control placeholder="Name" className="mb-2" onChange={e=>setProjData({...projData,name:e.target.value})}/><Form.Control as="textarea" placeholder="Desc" rows={4} onChange={e=>setProjData({...projData,description:e.target.value})}/></> : <><Form.Control placeholder="Name" className="mb-2" onChange={e=>setClientData({...clientData,name:e.target.value})}/><Form.Control placeholder="Role" className="mb-2" onChange={e=>setClientData({...clientData,designation:e.target.value})}/><Form.Control as="textarea" placeholder="Quote" rows={3} onChange={e=>setClientData({...clientData,description:e.target.value})}/></>}</Col>
                        <Col md={4} className="text-center"><div className="p-3 bg-light mb-2 rounded border">{(activeTab==='add_project'?projData.image:clientData.image)?'✅ Ready':'📷 Select'}</div><Form.Control type="file" onChange={e=>onSelectFile(e, activeTab==='add_project'?'project':'client')}/><Button className="w-100 mt-2" onClick={()=>handleUpload(activeTab==='add_project'?'project':'client')}>Save</Button></Col>
                    </Row>
                </Card>
            )}
        </div>

        <Modal show={showCropModal} onHide={()=>setShowCropModal(false)} centered><Modal.Body className="text-center bg-dark">{imgSrc && <ReactCrop crop={crop} onChange={(_,c)=>setCrop(c)} onComplete={c=>setCompletedCrop(c)} aspect={uploadType==='project'?450/350:1}><img ref={imgRef} src={imgSrc} onLoad={e=>setCrop(centerCrop(makeAspectCrop({unit:'%',width:90}, uploadType==='project'?450/350:1, e.currentTarget.width, e.currentTarget.height), e.currentTarget.width, e.currentTarget.height))} style={{maxHeight:'60vh'}}/></ReactCrop>}</Modal.Body><Modal.Footer><Button onClick={handleCropSave}>Crop</Button></Modal.Footer></Modal>
    </div>
  );
};

export default AdminPanel;