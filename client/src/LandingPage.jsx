import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Row, Col, Form, Modal, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ---------------------------------------------------------
// 🔴 LIVE BACKEND CONNECTION
// ---------------------------------------------------------
const API_BASE = "https://realestateassignment.onrender.com"; 
// ---------------------------------------------------------

// --- DUMMY DATA ---
const DUMMY_PROJECTS = [
  { _id: '1', name: 'Modern Villa', description: 'Beverly Hills, CA', details: 'A stunning modern villa located in the exclusive hills. Features 5 bedrooms, infinity pool, and smart home systems.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { _id: '2', name: 'Luxury Apartment', description: 'New York, NY', details: 'Penthouse suite with panoramic city views. Floor-to-ceiling windows and premium finishes throughout.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80' },
  { _id: '3', name: 'Cozy Cottage', description: 'Aspen, CO', details: 'The perfect winter getaway. Features a stone fireplace, heated floors, and ski-in/ski-out access.', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80' },
  { _id: '4', name: 'Urban Loft', description: 'Chicago, IL', details: 'Industrial-chic loft in the heart of downtown. Exposed brick walls and high ceilings.', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80' },
  { _id: '5', name: 'Seaside Manor', description: 'Miami, FL', details: 'Historic art-deco restoration in South Beach. Direct beach access and private dock.', image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=600&q=80' }
];

const DUMMY_CLIENTS = [
  { _id: '1', name: 'Michael Ross', designation: 'Entrepreneur', description: 'DreamHome found me the perfect office space in record time. Their professionalism is unmatched.', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { _id: '2', name: 'Sarah Jenkins', designation: 'Homeowner', description: 'I sold my house above asking price thanks to their incredible marketing strategy. Highly recommended!', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { _id: '3', name: 'David Chen', designation: 'Property Investor', description: 'The ROI analysis provided by DreamHome was spot on. They are true experts in the market.', image: 'https://randomuser.me/api/portraits/men/85.jpg' },
  { _id: '4', name: 'Emily Clark', designation: 'Interior Designer', description: 'A seamless experience from start to finish. The team really understood my vision.', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contactForm, setContactForm] = useState({ fullName: '', email: '', mobile: '', city: '' });
  const [emailSub, setEmailSub] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await axios.get(`${API_BASE}/projects`);
        setProjects(projRes.data.length > 0 ? projRes.data : DUMMY_PROJECTS);
        const clientRes = await axios.get(`${API_BASE}/clients`);
        setClients(clientRes.data.length > 0 ? clientRes.data : DUMMY_CLIENTS);
      } catch (err) {
        setProjects(DUMMY_PROJECTS);
        setClients(DUMMY_CLIENTS);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e) => { 
      e.preventDefault(); 
      try {
          await axios.post(`${API_BASE}/contact`, contactForm);
          alert("Quote Request Sent Successfully!");
          setContactForm({ fullName: '', email: '', mobile: '', city: '' });
      } catch (err) { alert("Error sending request."); }
  };

  const handleSubscribe = async () => {
      if(!emailSub) return;
      try {
          await axios.post(`${API_BASE}/subscribe`, { email: emailSub });
          alert("Subscribed Successfully!");
          setEmailSub('');
      } catch (err) { alert("Already subscribed."); }
  };

  const handleReadMore = (project) => { setSelectedProject(project); setShowModal(true); };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden', width: '100%' }}>
      
      {/* 1. NAVBAR - UPDATED WITH "DreamHome" */}
      <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm py-3" style={{zIndex: 1000}}>
        <Container>
          <Navbar.Brand href="#" className="fw-bold fs-3 d-flex align-items-center" style={{ color: '#0e2e50', letterSpacing: '-0.5px' }}>
             <i className="bi bi-house-heart-fill text-primary me-2 fs-2"></i>
             <span style={{color: '#333'}}>Dream</span><span style={{color: '#0e2e50'}}>Home</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-uppercase fw-bold align-items-center" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
              <Nav.Link href="#home" className="px-3" style={{color: '#333'}}>Home</Nav.Link>
              <Nav.Link href="#services" className="px-3" style={{color: '#333'}}>Services</Nav.Link>
              <Nav.Link href="#projects" className="px-3" style={{color: '#333'}}>Projects</Nav.Link>
              <Nav.Link href="#testimonials" className="px-3" style={{color: '#333'}}>Testimonials</Nav.Link>
              <Nav.Link href="#contact" className="px-3 text-warning">Contact</Nav.Link>
              <Link to="/admin">
                <Button size="sm" className="ms-3 px-4 py-2 fw-bold shadow-sm" style={{background: '#f05a28', border: 'none', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.75rem'}}>
                    Admin Panel
                </Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. HERO SECTION */}
      <div id="home" style={{ position: 'relative', width: '100vw', minHeight: '100vh', backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', paddingTop: '80px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <Container style={{ position: 'relative', zIndex: 2 }}>
            <Row className="align-items-center">
                <Col lg={7} className="text-white mb-5 mb-lg-0">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.2', textShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>Consultation,<br/>Design,<br/>& Marketing</h1>
                    <p className="lead mt-4 text-light opacity-90 fw-light" style={{maxWidth: '500px'}}>We provide world-class real estate services tailored to your unique needs. Let's build your future together.</p>
                </Col>
                <Col lg={5}>
                    <div className="p-4 p-md-5 rounded" style={{ backgroundColor: 'rgba(14, 46, 80, 0.95)', color: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        <h3 className="fw-bold mb-2">Get a Free Consultation</h3>
                        <p className="mb-4 small text-white-50">Fill out the form below and we will contact you shortly.</p>
                        <Form onSubmit={handleContactSubmit}>
                            <Form.Group className="mb-3"><Form.Control placeholder="Full Name" style={{ background: '#fff', border: 'none', height: '50px' }} value={contactForm.fullName} onChange={e => setContactForm({...contactForm, fullName: e.target.value})}/></Form.Group>
                            <Form.Group className="mb-3"><Form.Control placeholder="Email Address" style={{ background: '#fff', border: 'none', height: '50px' }} value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})}/></Form.Group>
                            <Form.Group className="mb-3"><Form.Control placeholder="Mobile Number" style={{ background: '#fff', border: 'none', height: '50px' }} value={contactForm.mobile} onChange={e => setContactForm({...contactForm, mobile: e.target.value})}/></Form.Group>
                            <Form.Group className="mb-4"><Form.Control placeholder="City / Area" style={{ background: '#fff', border: 'none', height: '50px' }} value={contactForm.city} onChange={e => setContactForm({...contactForm, city: e.target.value})}/></Form.Group>
                            <Button type="submit" className="w-100 fw-bold py-3 rounded-1 shadow-sm" style={{ backgroundColor: '#f05a28', border: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>GET QUICK QUOTE</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
          </Container>
      </div>

      {/* 3. SERVICES */}
      <div id="services">
        <Container className="py-5 text-center">
            <Row className="justify-content-center">
                <Col md={10} className="mb-5">
                    <h4 className="fw-bold text-dark" style={{color: '#0e2e50'}}>Not Your Average Realtor</h4>
                    <div style={{width: '60px', height: '4px', background: '#f05a28', margin: '15px auto'}}></div>
                    <p className="text-muted w-75 mx-auto">DreamHome is an innovative property group. We provide quality service to build relationships with clients.</p>
                </Col>
            </Row>
            <Row>
                <Col md={4} className="px-4 mb-4"><div className="p-3"><h5 className="fw-bold mb-3">Potential ROI</h5><p className="text-muted small">We analyze every detail to ensure you get the best return on investment.</p></div></Col>
                <Col md={4} className="px-4 mb-4"><div className="p-3 border-start border-end"><h5 className="fw-bold mb-3">Design</h5><p className="text-muted small">Our interior design background makes us the perfect guide for renovation.</p></div></Col>
                <Col md={4} className="px-4 mb-4"><div className="p-3"><h5 className="fw-bold mb-3">Marketing</h5><p className="text-muted small">We bring professional photography and digital marketing plans to every listing.</p></div></Col>
            </Row>
        </Container>
      </div>

      {/* 4. PROJECTS */}
      <div id="projects" className="py-5 bg-white">
        <Container>
         <h3 className="text-center fw-bold mb-5" style={{color: '#0e2e50'}}>Our Projects</h3>
         <Row className="justify-content-center g-4">
            {projects.slice(0, 5).map((p, i) => (
                <Col key={i} lg={2} md={4} sm={6} xs={12} style={{ minWidth: '19%' }}>
                    <Card className="h-100 border-0 shadow-sm project-card">
                        <div style={{ height: '180px', overflow: 'hidden' }}><Card.Img variant="top" src={p.image} style={{ height: '100%', objectFit: 'cover' }} /></div>
                        <Card.Body className="text-center p-3">
                            <h6 className="fw-bold mb-1 text-dark">{p.name}</h6>
                            <p className="text-muted small text-uppercase mb-3" style={{fontSize: '0.65rem'}}>{p.description}</p>
                            <Button size="sm" className="rounded-0 text-white fw-bold w-100" style={{ background: '#f05a28', border: 'none', fontSize: '0.7rem', padding: '8px 0' }} onClick={() => handleReadMore(p)}>READ MORE</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
         </Row>
        </Container>
      </div>

      {/* 5. TESTIMONIALS */}
      <div id="testimonials" className="py-5" style={{backgroundColor: '#f8f9fa'}}>
          <Container>
            <div className="text-center mb-5"><div style={{ width: '15px', height: '15px', background: '#00aaff', borderRadius: '50%', margin: '0 auto 20px' }}></div><h2 className="fw-bold" style={{color: '#0e2e50'}}>Happy Clients</h2></div>
            <Row className="justify-content-center">
                {clients.slice(0, 4).map((c, i) => (
                    <Col key={i} lg={3} md={6} className="mb-4">
                        <Card className="border-0 shadow-sm h-100 text-center py-4 px-3" style={{borderRadius: '10px'}}>
                            <div className="mx-auto mb-3" style={{width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #e9ecef'}}><img src={c.image} alt="client" style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                            <Card.Body className="p-0"><p className="small text-muted fst-italic mb-3">"{c.description}"</p><h6 className="fw-bold text-dark mb-0">{c.name}</h6><small className="text-primary fw-bold" style={{fontSize: '0.7rem', textTransform: 'uppercase'}}>{c.designation}</small></Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
          </Container>
      </div>

      {/* 6. SUBSCRIBER SECTION */}
      <div id="contact" style={{ background: '#00aaff', padding: '70px 0', color: 'white' }}>
          <Container>
              <Row className="align-items-center">
                  <Col md={6} className="text-center text-md-start mb-4 mb-md-0"><h3 className="fw-bold mb-2">Subscribe to Our Newsletter</h3><p className="mb-0 text-white-50">Join our mailing list for updates.</p></Col>
                  <Col md={6}><div className="d-flex justify-content-center justify-content-md-end"><input type="email" placeholder="Enter email" className="form-control me-2 border-0 shadow-sm" style={{height: '50px', maxWidth: '300px'}} value={emailSub} onChange={(e) => setEmailSub(e.target.value)} /><Button style={{ height: '50px', padding: '0 30px', background: '#333', border: 'none', fontWeight: 'bold' }} onClick={handleSubscribe}>SUBSCRIBE</Button></div></Col>
              </Row>
          </Container>
      </div>

      <div className="bg-dark text-white text-center py-4"><small className="opacity-50">&copy; 2023 DreamHome. All Rights Reserved.</small></div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0"><Modal.Title className="fw-bold text-dark">{selectedProject?.name}</Modal.Title></Modal.Header>
        <Modal.Body>{selectedProject && (<Row><Col md={6}><img src={selectedProject.image} className="img-fluid rounded mb-3 w-100 shadow-sm" /></Col><Col md={6}><h5 className="fw-bold text-primary mb-3">Project Overview</h5><p className="text-muted fw-bold mb-4">{selectedProject.description}</p><p>{selectedProject.details || "Details coming soon."}</p><div className="mt-4"><Button variant="danger" className="w-100 py-2 fw-bold" style={{background: '#f05a28', border:'none'}}>Contact Agent</Button></div></Col></Row>)}</Modal.Body>
      </Modal>
    </div>
  );
};

export default LandingPage;