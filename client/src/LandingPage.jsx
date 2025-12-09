import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Row, Col, Form, Modal, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ---------------------------------------------------------
// 🔴 LIVE BACKEND CONNECTION
// ---------------------------------------------------------
const API_BASE = "https://realestateassignment.onrender.com"; 
// ---------------------------------------------------------

const DUMMY_PROJECTS = [
  { _id: '1', name: 'Modern Villa', description: 'Beverly Hills, CA', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { _id: '2', name: 'Luxury Apartment', description: 'New York, NY', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80' },
  { _id: '3', name: 'Cozy Cottage', description: 'Aspen, CO', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80' },
  { _id: '4', name: 'Urban Loft', description: 'Chicago, IL', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80' },
  { _id: '5', name: 'Seaside Manor', description: 'Miami, FL', image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=600&q=80' },
  { _id: '6', name: 'Skyline Penthouse', description: 'Seattle, WA', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' }
];

const DUMMY_CLIENTS = [
  { _id: '1', name: 'Michael Ross', designation: 'CEO', description: 'DreamHome found me the perfect office space in record time.', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { _id: '2', name: 'Sarah Jenkins', designation: 'Director', description: 'I sold my house above asking price thanks to their incredible strategy.', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { _id: '3', name: 'David Chen', designation: 'Investor', description: 'The ROI analysis provided by DreamHome was spot on.', image: 'https://randomuser.me/api/portraits/men/85.jpg' },
];

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contactForm, setContactForm] = useState({ fullName: '', email: '', mobile: '', city: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await axios.get(`${API_BASE}/projects`);
        const c = await axios.get(`${API_BASE}/clients`);
        setProjects(p.data.length > 0 ? p.data : DUMMY_PROJECTS);
        setClients(c.data.length > 0 ? c.data : DUMMY_CLIENTS);
      } catch (err) {
        setProjects(DUMMY_PROJECTS);
        setClients(DUMMY_CLIENTS);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e) => { 
      e.preventDefault(); 
      try { await axios.post(`${API_BASE}/contact`, contactForm); alert("Request Sent! We will call you shortly."); setContactForm({ fullName: '', email: '', mobile: '', city: '' }); } 
      catch (err) { alert("Error sending request."); }
  };

  const handleReadMore = (p) => { setSelectedProject(p); setShowModal(true); };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", overflowX: 'hidden', width: '100%' }}>
      
      {/* 1. NAVBAR */}
      <Navbar expand="lg" fixed="top" className="py-3 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <Container>
          <Navbar.Brand href="#" className="fw-bold fs-3 d-flex align-items-center">
             <i className="bi bi-house-heart-fill text-danger me-2 fs-2"></i>
             <span style={{color: '#0e2e50'}}>Dream</span><span style={{color: '#f05a28'}}>Home</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>
              <Nav.Link href="#home" className="px-3 text-dark">Home</Nav.Link>
              <Nav.Link href="#services" className="px-3 text-dark">Services</Nav.Link>
              <Nav.Link href="#projects" className="px-3 text-dark">Properties</Nav.Link>
              <Nav.Link href="#testimonials" className="px-3 text-dark">Reviews</Nav.Link>
              <Link to="/admin"><Button size="sm" className="ms-3 px-4 fw-bold" style={{background: '#0e2e50', border:'none'}}>ADMIN</Button></Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. HERO SECTION */}
      <div id="home" style={{ 
          position: 'relative', width: '100vw', minHeight: '100vh', 
          background: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1950&q=80') fixed center/cover",
          display: 'flex', alignItems: 'center', paddingTop: '80px' 
      }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(14, 46, 80, 0.9) 0%, rgba(14, 46, 80, 0.4) 100%)' }}></div>
          <Container style={{ position: 'relative', zIndex: 2 }}>
            <Row className="align-items-center">
                <Col lg={7} className="text-white mb-5 mb-lg-0">
                    <span className="text-warning fw-bold small letter-spacing-2">PREMIUM REAL ESTATE</span>
                    <h1 className="display-3 fw-bold my-3">Find Your <span style={{color:'#f05a28'}}>Dream</span> Place</h1>
                    <p className="lead opacity-75 mb-4" style={{maxWidth:'500px'}}>We don't just sell houses. We help you find a place where your memories will live forever.</p>
                    <Button size="lg" className="rounded-pill px-5 fw-bold" style={{background:'#f05a28', border:'none'}}>EXPLORE PROPERTIES</Button>
                </Col>
                <Col lg={5}>
                    <div className="p-4 rounded-3 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <h3 className="fw-bold text-white mb-1">Get a Quote</h3>
                        <p className="text-white-50 small mb-3">Expert consultation is just a click away.</p>
                        <Form onSubmit={handleContactSubmit}>
                            <Form.Control placeholder="Full Name" className="mb-3 border-0" style={{height:'50px', background:'rgba(255,255,255,0.9)'}} onChange={e => setContactForm({...contactForm, fullName: e.target.value})}/>
                            <Form.Control placeholder="Email" className="mb-3 border-0" style={{height:'50px', background:'rgba(255,255,255,0.9)'}} onChange={e => setContactForm({...contactForm, email: e.target.value})}/>
                            <Form.Control placeholder="Mobile" className="mb-3 border-0" style={{height:'50px', background:'rgba(255,255,255,0.9)'}} onChange={e => setContactForm({...contactForm, mobile: e.target.value})}/>
                            <Form.Control placeholder="City" className="mb-4 border-0" style={{height:'50px', background:'rgba(255,255,255,0.9)'}} onChange={e => setContactForm({...contactForm, city: e.target.value})}/>
                            <Button type="submit" className="w-100 fw-bold py-3" style={{background: '#f05a28', border:'none'}}>SEND REQUEST</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
          </Container>
      </div>

      {/* 3. STATS STRIP */}
      <div className="py-5 text-white text-center" style={{background: '#0e2e50'}}>
          <Container>
              <Row>
                  <Col md={3} className="mb-4 mb-md-0"><h2 className="fw-bold text-warning">150+</h2><small>Premium Projects</small></Col>
                  <Col md={3} className="mb-4 mb-md-0"><h2 className="fw-bold text-warning">850+</h2><small>Happy Families</small></Col>
                  <Col md={3} className="mb-4 mb-md-0"><h2 className="fw-bold text-warning">12</h2><small>Years Experience</small></Col>
                  <Col md={3}><h2 className="fw-bold text-warning">24/7</h2><small>Support Available</small></Col>
              </Row>
          </Container>
      </div>

      {/* 4. SERVICES (FIXED: Added ID and Padding) */}
      <div id="services" style={{ scrollMarginTop: '100px', paddingTop: '60px', paddingBottom: '60px', background: '#fff' }}>
        <Container className="text-center">
            <div className="mb-5">
                <small className="text-danger fw-bold">OUR SERVICES</small>
                <h2 className="fw-bold text-dark">Why Choose DreamHome?</h2>
                <div style={{width:'60px', height:'4px', background:'#f05a28', margin:'15px auto'}}></div>
            </div>
            <Row className="g-4">
                {/* SERVICE 1 */}
                <Col md={4}>
                    <div className="p-4 h-100 border rounded-3 hover-shadow">
                        <div className="mb-3 text-primary"><i className="bi bi-graph-up-arrow display-4"></i></div>
                        <h5 className="fw-bold">ROI Analysis</h5>
                        <p className="text-muted small">We analyze every detail to ensure you get the best return on your property investment.</p>
                    </div>
                </Col>
                {/* SERVICE 2 */}
                <Col md={4}>
                    <div className="p-4 h-100 border rounded-3 hover-shadow">
                        <div className="mb-3 text-primary"><i className="bi bi-palette display-4"></i></div>
                        <h5 className="fw-bold">Interior Design</h5>
                        <p className="text-muted small">Our extensive design background makes us the perfect guide for your renovation.</p>
                    </div>
                </Col>
                {/* SERVICE 3 */}
                <Col md={4}>
                    <div className="p-4 h-100 border rounded-3 hover-shadow">
                        <div className="mb-3 text-primary"><i className="bi bi-shield-check display-4"></i></div>
                        <h5 className="fw-bold">Legal Support</h5>
                        <p className="text-muted small">We handle all the paperwork and legalities so you can enjoy a stress-free process.</p>
                    </div>
                </Col>
            </Row>
        </Container>
      </div>

      {/* 5. PROJECTS GRID */}
      <div id="projects" style={{ scrollMarginTop: '100px', padding: '60px 0', background: '#f8f9fa' }}>
        <Container>
         <div className="d-flex justify-content-between align-items-end mb-5">
             <div><h2 className="fw-bold text-dark m-0">Featured Properties</h2><p className="text-muted m-0">Handpicked luxury for you.</p></div>
             <Button variant="outline-dark" className="d-none d-md-block">View All</Button>
         </div>
         <Row className="g-4">
            {projects.slice(0, 6).map((p, i) => (
                <Col key={i} lg={4} md={6}>
                    <Card className="h-100 border-0 shadow-sm" style={{cursor:'pointer', transition:'transform 0.2s'}} 
                          onMouseOver={e=>e.currentTarget.style.transform='translateY(-5px)'} 
                          onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                        <div style={{height:'250px', overflow:'hidden', position:'relative'}}>
                            <Card.Img variant="top" src={p.image} style={{height:'100%', objectFit:'cover'}} />
                            <Badge bg="danger" style={{position:'absolute', top:'10px', left:'10px'}}>FOR SALE</Badge>
                        </div>
                        <Card.Body>
                            <h5 className="fw-bold mb-1">{p.name}</h5>
                            <p className="text-muted small mb-3"><i className="bi bi-geo-alt-fill text-danger me-1"></i>{p.description}</p>
                            <Button size="sm" className="w-100 fw-bold" style={{background:'#0e2e50', border:'none'}} onClick={() => handleReadMore(p)}>VIEW DETAILS</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
         </Row>
        </Container>
      </div>

      {/* 6. TESTIMONIALS */}
      <Container id="testimonials" style={{ scrollMarginTop: '100px', padding: '60px 0' }} className="text-center">
        <h2 className="fw-bold mb-5">Client Stories</h2>
        <Row className="justify-content-center">
            {clients.slice(0, 3).map((c, i) => (
                <Col key={i} md={4} className="mb-4">
                    <Card className="border-0 shadow-sm p-4 h-100">
                        <div className="mx-auto mb-3"><img src={c.image} className="rounded-circle border border-3 border-white shadow" width="80" height="80" style={{objectFit:'cover'}} /></div>
                        <p className="fst-italic text-muted">"{c.description.substring(0,80)}..."</p>
                        <h6 className="fw-bold m-0">{c.name}</h6>
                        <small className="text-primary fw-bold text-uppercase">{c.designation}</small>
                    </Card>
                </Col>
            ))}
        </Row>
      </Container>

      {/* 7. FOOTER */}
      <div className="text-white py-5" style={{background:'#1a1a1a'}}>
          <Container>
              <Row>
                  <Col md={4} className="mb-4">
                      <h4 className="fw-bold mb-3">Dream<span className="text-primary">Home</span></h4>
                      <p className="small opacity-50">Building dreams, one home at a time.</p>
                  </Col>
                  <Col md={4} className="mb-4">
                      <h5 className="fw-bold">Contact Us</h5>
                      <p className="small m-0">123 Market St, San Francisco</p>
                      <p className="small m-0">support@dreamhome.com</p>
                  </Col>
                  <Col md={4}>
                      <h5 className="fw-bold">Follow Us</h5>
                      <div className="d-flex gap-3 fs-4">
                          <i className="bi bi-facebook cursor-pointer"></i>
                          <i className="bi bi-instagram cursor-pointer"></i>
                          <i className="bi bi-twitter cursor-pointer"></i>
                      </div>
                  </Col>
              </Row>
              <hr className="opacity-25 my-4"/>
              <p className="text-center small opacity-50 m-0">&copy; 2023 DreamHome Inc. All Rights Reserved.</p>
          </Container>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton><Modal.Title className="fw-bold">{selectedProject?.name}</Modal.Title></Modal.Header>
        <Modal.Body>
            <img src={selectedProject?.image} className="img-fluid rounded w-100 mb-3" />
            <p className="lead">{selectedProject?.description}</p>
            <p className="text-muted">Experience luxury living in this magnificent property. Featuring state-of-the-art amenities, spacious interiors, and breathtaking views.</p>
            <Button className="w-100 fw-bold py-2" style={{background:'#f05a28', border:'none'}}>Schedule Viewing</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LandingPage;