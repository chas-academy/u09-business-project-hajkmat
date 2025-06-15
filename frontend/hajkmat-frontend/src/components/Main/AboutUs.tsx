import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Om Hajkmat</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mitt uppdrag</h2>
        <p className="mb-4">
          Välkommen till Hajkmat - din ultimata följeslagare för måltidsplanering och matlagning på
          äventyr! Jag startade Hajkmat med en enkel vision: att göra utomhusmatlagning enklare,
          roligare och mer tillgänglig för alla äventyrare och naturälskare.
        </p>
        <p>
          Oavsett om du planerar en dagsutflykt, en långhelg i vildmarken eller en längre vandring,
          hjälper Hajkmat dig att planera, organisera och förbereda dina måltider så att du kan
          fokusera på det viktigaste att njuta av naturen.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Vad Hajkmat erbjuder</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Receptsamlingar</h3>
            <p>
              Utforska hundratals recept speciellt anpassade för utomhusmatlagning. Varje recept är
              testat i fält och optimerat för enkla ingredienser och minimal utrustning.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Personliga listor</h3>
            <p>
              Skapa dina egna receptlistor och anpassa dem efter dina preferenser, kostrestriktioner
              och typen av äventyr du planerar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
