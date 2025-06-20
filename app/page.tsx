export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Placemarks Admin</h1>
      <p className="text-muted-foreground mb-8">
        Admin Dashboard
      </p>
      <div className="text-sm text-muted-foreground">
        <a href="/login" className="text-blue-500 hover:underline">
          Go to Login
        </a>
      </div>
    </div>
  );
}
