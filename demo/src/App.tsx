import AccordionDemo from './content/AccordionDemo.mdx'
import PopoverDemo from './content/PopoverDemo.mdx'
import CarouselDemo from './content/CarouselDemo.mdx'

function App() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        MDX Components Demo
      </h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          Accordion Transformer
        </h2>
        <AccordionDemo />
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          Popover Transformer
        </h2>
        <PopoverDemo />
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          Carousel Transformer
        </h2>
        <CarouselDemo />
      </section>
    </div>
  )
}

export default App
