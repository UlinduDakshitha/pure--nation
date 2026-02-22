import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Trash2, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className={styles.heroContent}>
                        <h1>Let's Make Sri Lanka <br /><span className={styles.highlight}>Cleaner & Greener</span></h1>
                        <p>Join the movement to protect our paradise. Volunteer for cleaning projects, earn rewards, and make a lasting impact.</p>
                        <div className={styles.heroButtons}>
                            <Link to="/projects">
                                <Button variant="primary" size="lg">Join a Project</Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" size="lg" style={{ color: 'white', borderColor: 'white' }}>Learn More</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><Trash2 size={32} /></div>
                            <h3>5,000+ kg</h3>
                            <p>Waste Collected</p>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><Users size={32} /></div>
                            <h3>1,200+</h3>
                            <p>Active Volunteers</p>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}><MapPin size={32} /></div>
                            <h3>50+</h3>
                            <p>Sites Cleaned</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Introduction */}
            <section className="section container">
                <div className={styles.featuresLayout}>
                    <div className={styles.featureText}>
                        <h2>Why Join <span className="text-primary">Pure Nation?</span></h2>
                        <p>We are a community-driven platform dedicated to restoring the natural beauty of Sri Lanka. Whether you're an individual, a student group, or a corporate team, you can make a difference.</p>

                        <ul className={styles.featureList}>
                            <li>
                                <strong>Volunteer Easily:</strong> Find cleaning events near you and sign up in seconds.
                            </li>
                            <li>
                                <strong>Earn Rewards:</strong> Get recognized for your hard work with points, badges, and certificates.
                            </li>
                            <li>
                                <strong>Track Impact:</strong> See real-time data on how your contributions are helping the environment.
                            </li>
                        </ul>
                        <Link to="/register">
                            <Button variant="secondary">Start Your Journey <ArrowRight size={16} style={{ marginLeft: '8px' }} /></Button>
                        </Link>
                    </div>
                    <div className={styles.featureImage}>
                        <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Volunteers cleaning nature" />
                    </div>
                </div>
            </section>

            {/* Featured Projects Preview */}
            <section className="section" style={{ backgroundColor: 'var(--surface-alt)' }}>
                <div className="container">
                    <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                        <h2>Upcoming Projects</h2>
                        <Link to="/projects">
                            <Button variant="ghost">View All <ArrowRight size={16} /></Button>
                        </Link>
                    </div>

                    <div className={styles.projectGrid}>
                        {/* Mock Project Cards */}
                        {[1, 2, 3].map((item) => (
                            <div key={item} className={styles.projectCard}>
                                <div className={styles.projectImage} style={{ backgroundImage: `url(https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)` }}>
                                    <span className={styles.projectTag}>Beach Cleanup</span>
                                </div>
                                <div className={styles.projectContent}>
                                    <h3>Mount Lavinia Beach Cleanup</h3>
                                    <div className={styles.projectMeta}>
                                        <span><MapPin size={14} /> Colombo</span>
                                        <span><Users size={14} /> 25/50 Joined</span>
                                    </div>
                                    <Link to={`/projects/${item}`} style={{ width: '100%' }}>
                                        <Button variant="primary" size="sm" style={{ width: '100%' }}>View Details</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action - Sponsors */}
            <section className="section container text-center">
                <h2>Become a Sponsor</h2>
                <p style={{ maxWidth: '600px', margin: '1rem auto 2rem', color: 'var(--text-secondary)' }}>
                    Support our mission by providing resources or funding. Your brand will be recognized as a champion of the environment.
                </p>
                <Link to="/sponsors">
                    <Button variant="outline">Partner With Us</Button>
                </Link>
            </section>
        </div>
    );
};

export default Home;
