import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Row, Col, Form, Modal, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = "https://realestateassignment.onrender.com"; 

// --- INSTANT DATA (No Waiting) ---
const DATA_PROJECTS = [
  { _id: '1', name: 'Modern Villa', description: 'Beverly Hills, CA', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { _id: '2', name: 'Luxury Apartment', description: 'New York, NY', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80' },
  { _id: '3', name: 'Cozy Cottage', description: 'Aspen, CO', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80' },
  { _id: '4', name: 'Urban Loft', description: 'Chicago, IL', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80' },
  { _id: '5', name: 'Seaside Manor', description: 'Miami, FL', image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=600&q=80' },
  { _id: '6', name: 'Skyline Penthouse', description: 'Seattle, WA', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' }
];

const DATA_CLIENTS = [
  { _id: '1', name: 'Michael Ross', designation: 'CEO', description: 'DreamHome found me the perfect office space in record time.', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { _id: '2', name: 'Sarah Jenkins', designation: 'Director', description: 'I sold my house above asking price thanks to their incredible strategy.', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { _id: '3', name: 'David Chen', designation: 'Investor', description: 'The ROI analysis provided by DreamHome was spot on.', image: 'https://randomuser.me/api/portraits/men/85.jpg' },
];

const LandingPage = () => {
  const [projects, setProjects] = useState(DATA_PROJECTS);
  const [clients, setClients] = useState(DATA_CLIENTS);
  const [contactForm, setContactForm] = useState({ fullName: '', email: '', mobile: '', city: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await axios.get(`${API_BASE}/projects`);
        if (p.data.length > 0) setProjects(p.data);
      } catch (err) { console.log("Using instant data"); }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e) => { e.preventDefault(); try { await axios.post(`${API_BASE}/contact`, contactForm); alert("Request Sent!"); } catch (err) { alert("Error sending."); } };
  const handleReadMore = (p) => { setSelectedProject(p); setShowModal(true); };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden', width: '100%' }}>
      
      <Navbar expand="lg" fixed="top" className="py-3 shadow-sm bg-white">
        <Container>
          <Navbar.Brand href="#" className="fw-bold fs-3 d-flex align-items-center">
             <i className="bi bi-house-heart-fill text-danger me-2 fs-2"></i>
             <span style={{color: '#0e2e50'}}>Dream</span><span style={{color: '#f05a28'}}>Home</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto fw-bold text-uppercase small">
              <Nav.Link href="#home" className="px-3 text-dark">Home</Nav.Link>
              <Nav.Link href="#services" className="px-3 text-dark">Services</Nav.Link>
              <Nav.Link href="#projects" className="px-3 text-dark">Properties</Nav.Link>
              <Nav.Link href="#testimonials" className="px-3 text-dark">Reviews</Nav.Link>
              <Link to="/admin"><Button size="sm" className="ms-3 px-4 fw-bold" style={{background: '#0e2e50', border:'none'}}>ADMIN</Button></Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div id="home" style={{ position: 'relative', width: '100vw', minHeight: '100vh', background: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1950&q=80') center/cover", display: 'flex', alignItems: 'center', paddingTop: '80px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))' }}></div>
          <Container style={{ position: 'relative', zIndex: 2 }}>
            <Row className="align-items-center">
                <Col lg={7} className="text-white mb-5 mb-lg-0">
                    <h1 className="display-3 fw-bold my-3">Find Your Dream Place</h1>
                    <p className="lead">We don't just sell houses. We help you find a home.</p>
                </Col>
                <Col lg={5}>
                    <div className="p-4 rounded-3 shadow-lg bg-white">
                        <h3 className="fw-bold text-dark mb-3">Get a Quote</h3>
                        <Form onSubmit={handleContactSubmit}>
                            <Form.Control placeholder="Name" className="mb-3" onChange={e => setContactForm({...contactForm, fullName: e.target.value})}/>
                            <Form.Control placeholder="Email" className="mb-3" onChange={e => setContactForm({...contactForm, email: e.target.value})}/>
                            <Form.Control placeholder="Mobile" className="mb-3" onChange={e => setContactForm({...contactForm, mobile: e.target.value})}/>
                            <Button type="submit" className="w-100 fw-bold py-3" style={{background: '#f05a28', border:'none'}}>SEND REQUEST</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
          </Container>
      </div>

      <div id="services" style={{ scrollMarginTop: '100px', padding: '60px 0', background: '#fff' }}>
        <Container className="text-center">
            <h2 className="fw-bold mb-5">Our Services</h2>
            <Row className="g-4">
                <Col md={4} sm={12}><div className="p-4 h-100 border rounded"><i className="bi bi-graph-up-arrow display-4 text-primary"></i><h5 className="mt-3">ROI Analysis</h5></div></Col>
                <Col md={4} sm={12}><div className="p-4 h-100 border rounded"><i className="bi bi-palette display-4 text-primary"></i><h5 className="mt-3">Interior Design</h5></div></Col>
                <Col md={4} sm={12}><div className="p-4 h-100 border rounded"><i className="bi bi-shield-check display-4 text-primary"></i><h5 className="mt-3">Legal Support</h5></div></Col>
            </Row>
        </Container>
      </div>

      <div id="projects" style={{ scrollMarginTop: '100px', padding: '60px 0', background: '#f8f9fa' }}>
        <Container>
         <h2 className="text-center fw-bold mb-5">Featured Properties</h2>
         <Row className="g-4">
            {projects.slice(0, 6).map((p, i) => (
                <Col key={i} lg={4} md={6} sm={12} xs={12}>
                    <Card className="h-100 border-0 shadow-sm">
                        <div style={{height:'220px', overflow:'hidden'}}><Card.Img variant="top" src={p.image} style={{height:'100%', objectFit:'cover'}} /></div>
                        <Card.Body>
                            <h5 className="fw-bold">{p.name}</h5>
                            <p className="text-muted small">{p.description}</p>
                            <Button size="sm" className="w-100" style={{background:'#0e2e50'}} onClick={() => handleReadMore(p)}>DETAILS</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
         </Row>
        </Container>
      </div>

      {/* REVIEWS: ALWAYS VISIBLE */}
      <div id="testimonials" style={{ scrollMarginTop: '100px', padding: '80px 0', background: '#0e2e50' }}>
        <Container className="text-center">
            <h2 className="fw-bold mb-5 text-white">Client Stories</h2>
            <Row className="justify-content-center g-4">
                {clients.map((c, i) => (
                    <Col key={i} lg={4} md={6} sm={12} xs={12}>
                        <Card className="border-0 shadow-lg p-4 h-100">
                            <div className="mx-auto mb-3"><img src={c.image} className="rounded-circle" width="80" height="80" style={{objectFit:'cover'}}/></div>
                            <p className="fst-italic text-muted">"{c.description}"</p>
                            <h6 className="fw-bold m-0">{c.name}</h6>
                            <small className="text-primary fw-bold">{c.designation}</small>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
      </div>

      <div className="text-white py-4 text-center" style={{background:'#111'}}><small>&copy; 2023 DreamHome.</small></div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{selectedProject?.name}</Modal.Title></Modal.Header>
        <Modal.Body>
            {selectedProject && <><img src={selectedProject.image} className="img-fluid rounded mb-3 w-100" /><p>{selectedProject.description}</p></>}
            <Button className="w-100 fw-bold" style={{background:'#f05a28', border:'none'}}>Contact Agent</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LandingPage;