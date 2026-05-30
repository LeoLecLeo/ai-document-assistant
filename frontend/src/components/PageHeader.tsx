export function PageHeader() {
  return (
    <header className="mb-10">
      <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
        AI Document Assistant
      </p>

      <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
        Interroge tes documents PDF avec l’IA.
      </h1>

      <p className="mt-5 max-w-2xl text-neutral-300">
        Upload un PDF, pose une question, et obtiens une réponse basée sur les
        sources retrouvées dans le document.
      </p>
    </header>
  );
}