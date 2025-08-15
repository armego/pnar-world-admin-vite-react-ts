const ContactPage: React.FC = () => (
  <section className="section">
    <h2 className="title">Contact Us</h2>
    <p>Have questions or need support? Reach out to our team:</p>
    <ul>
      <li>
        Email:{' '}
        <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>
      </li>
      <li>
        Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
      </li>
      <li>Address: 123 Main Street, Suite 100, Your City, Country</li>
    </ul>
    <p>We aim to respond to all inquiries within 24 hours.</p>
  </section>
);

export default ContactPage;
