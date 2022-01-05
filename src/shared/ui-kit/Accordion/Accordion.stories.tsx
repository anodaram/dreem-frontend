import { Meta } from "@storybook/react";
import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "./Accordion";
import { grid } from "../../constants/const";

export default {
  title: "surfaces/Accordion",
  component: Accordion,
} as Meta;

export const example = () => (
  <>
    <p style={{ marginBottom: grid(8) }}>
      Accordion component is just styled MaterialUI Accordion, for API reference go to{" "}
      <a
        href="https://material-ui.com/components/accordion/#accordion"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://material-ui.com/components/accordion/#accordion
      </a>
    </p>
    <Accordion defaultExpanded>
      <AccordionSummary>💰 Price</AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a tellus lacus. Suspendisse eget
        vestibulum nulla. Suspendisse sed aliquam neque, vel tristique tortor. Donec non dui tincidunt,
        tristique felis in, fermentum nisl. Curabitur condimentum odio a nunc varius auctor. Morbi quis
        aliquam lorem. Donec enim odio, condimentum at eleifend a, convallis a turpis. Integer est nunc,
        vestibulum sit amet orci in, maximus malesuada tellus. Pellentesque aliquet pretium tellus, nec dictum
        justo fermentum sodales.
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary>🔍 Media Details</AccordionSummary>
      <AccordionDetails>
        Aenean sagittis augue quis orci blandit luctus. Nam vulputate eget erat eget pharetra. Sed tincidunt,
        tellus et vulputate mattis, mi urna consectetur dui, eget maximus libero odio vel dui. Suspendisse a
        velit ut velit varius consequat eget sit amet libero. Integer sodales sapien et metus finibus aliquam.
        In imperdiet id nunc a lacinia. Etiam eu sem risus. Etiam nec libero risus. Cras ornare pretium
        aliquam. Morbi molestie sem lorem, ut lacinia lacus semper eget. Vivamus elementum, sapien eu gravida
        auctor, ipsum orci tincidunt nisl, eget sagittis mi lacus et purus.
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary>📂 Collection</AccordionSummary>
      <AccordionDetails>
        Phasellus varius auctor enim non efficitur. Etiam vitae urna ullamcorper, blandit tortor ut, lacinia
        augue. Quisque vitae nisl in quam tempus pretium ac id orci. Proin nec tincidunt mauris. Fusce sit
        amet felis diam. Donec nec diam cursus, euismod enim ut, varius lorem. Cras varius quam vitae vehicula
        facilisis. Vivamus rhoncus arcu sit amet tincidunt mattis. Fusce efficitur vestibulum ante eu
        pellentesque. Sed ac felis molestie, vestibulum lectus a, interdum ipsum. Aenean efficitur laoreet
        odio. Nulla massa dolor, maximus at faucibus ac, tempus et nisi. Interdum et malesuada fames ac ante
        ipsum primis in faucibus. In non sapien id lectus dictum dictum. Quisque nec varius massa.
      </AccordionDetails>
    </Accordion>
  </>
);
