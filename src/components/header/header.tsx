import ThemeToggle from "../themes/toggle-theme";

const Header = () => {
  return (
    <header>
      <nav>This is the header</nav>
      <div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
