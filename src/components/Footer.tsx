export default function Footer() {
  return (
    <footer className="mt-4 border-t border-gray-200 bg-nav">
      <div className="container-page py-8 text-center text-sm font-medium text-gray-600">
        &copy; {new Date().getFullYear()} Blogify. All rights reserved.
      </div>
    </footer>
  );
}
