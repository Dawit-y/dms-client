import {
  Container,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

function App() {
  return (
    <Container className="p-3">
      <Accordion>
        <AccordionItem>
          <AccordionHeader>Header</AccordionHeader>
          <AccordionBody>This is the body of the accordion item.</AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>Header</AccordionHeader>
          <AccordionBody>This is the body of the second item.</AccordionBody>
        </AccordionItem>
      </Accordion>
      <h1>something</h1>
    </Container>
  );
}

export default App;
