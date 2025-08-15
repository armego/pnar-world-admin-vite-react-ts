interface ILayout {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children, header, footer }) => (
  <div className="is-flex is-flex-direction-column is-fullheight">
    <div>{header}</div>
    <div className="flex-grow-1">{children}</div>
    <div>{footer}</div>
  </div>
);

export default Layout;
