export default function Bell({ color = "block", size = 18, fill = false }) {
    if (fill)
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75V13.25ZM16 14.75C16.4142 14.75 16.75 14.4142 16.75 14C16.75 13.5858 16.4142 13.25 16 13.25V14.75ZM8 5.25C7.58579 5.25 7.25 5.58579 7.25 6C7.25 6.41421 7.58579 6.75 8 6.75V5.25ZM16 6.75C16.4142 6.75 16.75 6.41421 16.75 6C16.75 5.58579 16.4142 5.25 16 5.25V6.75ZM8 9.25C7.58579 9.25 7.25 9.58579 7.25 10C7.25 10.4142 7.58579 10.75 8 10.75V9.25ZM16 10.75C16.4142 10.75 16.75 10.4142 16.75 10C16.75 9.58579 16.4142 9.25 16 9.25V10.75ZM5 17.25C4.58579 17.25 4.25 17.5858 4.25 18C4.25 18.4142 4.58579 18.75 5 18.75V17.25ZM19 18.75C19.4142 18.75 19.75 18.4142 19.75 18C19.75 17.5858 19.4142 17.25 19 17.25V18.75ZM5.07805 21.7748L4.73232 22.4404L5.07805 21.7748ZM4.22517 20.9219L3.55961 21.2677L4.22517 20.9219ZM19.7748 20.9219L20.4404 21.2677L19.7748 20.9219ZM18.9219 21.7748L19.2677 22.4404L18.9219 21.7748ZM18.9219 2.22517L19.2677 1.55961L18.9219 2.22517ZM19.7748 3.07805L20.4404 2.73232L19.7748 3.07805ZM5.07805 2.22517L4.73232 1.55961L5.07805 2.22517ZM4.22517 3.07805L3.55961 2.73232L4.22517 3.07805ZM8 14.75H16V13.25H8V14.75ZM8 6.75H16V5.25H8V6.75ZM8 10.75H16V9.25H8V10.75ZM5 18.75H19V17.25H5V18.75ZM7.22 2.75H16.78V1.25H7.22V2.75ZM19.25 5.22V18.78H20.75V5.22H19.25ZM16.78 21.25H7.22V22.75H16.78V21.25ZM4.75 18.78V5.22H3.25V18.78H4.75ZM7.22 21.25C6.63792 21.25 6.24722 21.2494 5.94653 21.2244C5.65482 21.2002 5.51562 21.157 5.42378 21.1093L4.73232 22.4404C5.07395 22.6179 5.43624 22.6872 5.82239 22.7193C6.19956 22.7506 6.6631 22.75 7.22 22.75V21.25ZM3.25 18.78C3.25 19.3369 3.2494 19.8004 3.28072 20.1776C3.31279 20.5638 3.38215 20.926 3.55961 21.2677L4.89073 20.5762C4.84303 20.4844 4.7998 20.3452 4.77557 20.0535C4.7506 19.7528 4.75 19.3621 4.75 18.78H3.25ZM5.42378 21.1093C5.19548 20.9907 5.00933 20.8045 4.89073 20.5762L3.55961 21.2677C3.82052 21.77 4.23005 22.1795 4.73232 22.4404L5.42378 21.1093ZM19.25 18.78C19.25 19.3621 19.2494 19.7528 19.2244 20.0535C19.2002 20.3452 19.157 20.4844 19.1093 20.5762L20.4404 21.2677C20.6179 20.926 20.6872 20.5638 20.7193 20.1776C20.7506 19.8004 20.75 19.3369 20.75 18.78H19.25ZM16.78 22.75C17.3369 22.75 17.8004 22.7506 18.1776 22.7193C18.5638 22.6872 18.926 22.6179 19.2677 22.4404L18.5762 21.1093C18.4844 21.157 18.3452 21.2002 18.0535 21.2244C17.7528 21.2494 17.3621 21.25 16.78 21.25V22.75ZM19.1093 20.5762C18.9907 20.8045 18.8045 20.9907 18.5762 21.1093L19.2677 22.4404C19.7699 22.1795 20.1795 21.77 20.4404 21.2677L19.1093 20.5762ZM16.78 2.75C17.3621 2.75 17.7528 2.7506 18.0535 2.77557C18.3452 2.7998 18.4844 2.84302 18.5762 2.89073L19.2677 1.55961C18.926 1.38215 18.5638 1.31279 18.1776 1.28072C17.8004 1.2494 17.3369 1.25 16.78 1.25V2.75ZM20.75 5.22C20.75 4.6631 20.7506 4.19956 20.7193 3.82239C20.6872 3.43624 20.6179 3.07395 20.4404 2.73232L19.1093 3.42378C19.157 3.51562 19.2002 3.65482 19.2244 3.94653C19.2494 4.24722 19.25 4.63792 19.25 5.22H20.75ZM18.5762 2.89073C18.8045 3.00933 18.9907 3.19548 19.1093 3.42378L20.4404 2.73232C20.1795 2.23005 19.7699 1.82052 19.2677 1.55961L18.5762 2.89073ZM7.22 1.25C6.6631 1.25 6.19956 1.2494 5.82239 1.28072C5.43624 1.31279 5.07395 1.38215 4.73232 1.55961L5.42378 2.89073C5.51562 2.84303 5.65482 2.7998 5.94653 2.77557C6.24722 2.7506 6.63792 2.75 7.22 2.75V1.25ZM4.75 5.22C4.75 4.63792 4.7506 4.24722 4.77557 3.94653C4.7998 3.65482 4.84302 3.51562 4.89073 3.42378L3.55961 2.73232C3.38215 3.07395 3.31279 3.43624 3.28072 3.82239C3.2494 4.19956 3.25 4.6631 3.25 5.22H4.75ZM4.73232 1.55961C4.23005 1.82052 3.82052 2.23005 3.55961 2.73232L4.89073 3.42378C5.00933 3.19548 5.19548 3.00933 5.42378 2.89073L4.73232 1.55961Z" fill="#323539"/>
      </svg>
      );
  
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75V13.25ZM16 14.75C16.4142 14.75 16.75 14.4142 16.75 14C16.75 13.5858 16.4142 13.25 16 13.25V14.75ZM8 5.25C7.58579 5.25 7.25 5.58579 7.25 6C7.25 6.41421 7.58579 6.75 8 6.75V5.25ZM16 6.75C16.4142 6.75 16.75 6.41421 16.75 6C16.75 5.58579 16.4142 5.25 16 5.25V6.75ZM8 9.25C7.58579 9.25 7.25 9.58579 7.25 10C7.25 10.4142 7.58579 10.75 8 10.75V9.25ZM16 10.75C16.4142 10.75 16.75 10.4142 16.75 10C16.75 9.58579 16.4142 9.25 16 9.25V10.75ZM5 17.25C4.58579 17.25 4.25 17.5858 4.25 18C4.25 18.4142 4.58579 18.75 5 18.75V17.25ZM19 18.75C19.4142 18.75 19.75 18.4142 19.75 18C19.75 17.5858 19.4142 17.25 19 17.25V18.75ZM5.07805 21.7748L4.73232 22.4404L5.07805 21.7748ZM4.22517 20.9219L3.55961 21.2677L4.22517 20.9219ZM19.7748 20.9219L20.4404 21.2677L19.7748 20.9219ZM18.9219 21.7748L19.2677 22.4404L18.9219 21.7748ZM18.9219 2.22517L19.2677 1.55961L18.9219 2.22517ZM19.7748 3.07805L20.4404 2.73232L19.7748 3.07805ZM5.07805 2.22517L4.73232 1.55961L5.07805 2.22517ZM4.22517 3.07805L3.55961 2.73232L4.22517 3.07805ZM8 14.75H16V13.25H8V14.75ZM8 6.75H16V5.25H8V6.75ZM8 10.75H16V9.25H8V10.75ZM5 18.75H19V17.25H5V18.75ZM7.22 2.75H16.78V1.25H7.22V2.75ZM19.25 5.22V18.78H20.75V5.22H19.25ZM16.78 21.25H7.22V22.75H16.78V21.25ZM4.75 18.78V5.22H3.25V18.78H4.75ZM7.22 21.25C6.63792 21.25 6.24722 21.2494 5.94653 21.2244C5.65482 21.2002 5.51562 21.157 5.42378 21.1093L4.73232 22.4404C5.07395 22.6179 5.43624 22.6872 5.82239 22.7193C6.19956 22.7506 6.6631 22.75 7.22 22.75V21.25ZM3.25 18.78C3.25 19.3369 3.2494 19.8004 3.28072 20.1776C3.31279 20.5638 3.38215 20.926 3.55961 21.2677L4.89073 20.5762C4.84303 20.4844 4.7998 20.3452 4.77557 20.0535C4.7506 19.7528 4.75 19.3621 4.75 18.78H3.25ZM5.42378 21.1093C5.19548 20.9907 5.00933 20.8045 4.89073 20.5762L3.55961 21.2677C3.82052 21.77 4.23005 22.1795 4.73232 22.4404L5.42378 21.1093ZM19.25 18.78C19.25 19.3621 19.2494 19.7528 19.2244 20.0535C19.2002 20.3452 19.157 20.4844 19.1093 20.5762L20.4404 21.2677C20.6179 20.926 20.6872 20.5638 20.7193 20.1776C20.7506 19.8004 20.75 19.3369 20.75 18.78H19.25ZM16.78 22.75C17.3369 22.75 17.8004 22.7506 18.1776 22.7193C18.5638 22.6872 18.926 22.6179 19.2677 22.4404L18.5762 21.1093C18.4844 21.157 18.3452 21.2002 18.0535 21.2244C17.7528 21.2494 17.3621 21.25 16.78 21.25V22.75ZM19.1093 20.5762C18.9907 20.8045 18.8045 20.9907 18.5762 21.1093L19.2677 22.4404C19.7699 22.1795 20.1795 21.77 20.4404 21.2677L19.1093 20.5762ZM16.78 2.75C17.3621 2.75 17.7528 2.7506 18.0535 2.77557C18.3452 2.7998 18.4844 2.84302 18.5762 2.89073L19.2677 1.55961C18.926 1.38215 18.5638 1.31279 18.1776 1.28072C17.8004 1.2494 17.3369 1.25 16.78 1.25V2.75ZM20.75 5.22C20.75 4.6631 20.7506 4.19956 20.7193 3.82239C20.6872 3.43624 20.6179 3.07395 20.4404 2.73232L19.1093 3.42378C19.157 3.51562 19.2002 3.65482 19.2244 3.94653C19.2494 4.24722 19.25 4.63792 19.25 5.22H20.75ZM18.5762 2.89073C18.8045 3.00933 18.9907 3.19548 19.1093 3.42378L20.4404 2.73232C20.1795 2.23005 19.7699 1.82052 19.2677 1.55961L18.5762 2.89073ZM7.22 1.25C6.6631 1.25 6.19956 1.2494 5.82239 1.28072C5.43624 1.31279 5.07395 1.38215 4.73232 1.55961L5.42378 2.89073C5.51562 2.84303 5.65482 2.7998 5.94653 2.77557C6.24722 2.7506 6.63792 2.75 7.22 2.75V1.25ZM4.75 5.22C4.75 4.63792 4.7506 4.24722 4.77557 3.94653C4.7998 3.65482 4.84302 3.51562 4.89073 3.42378L3.55961 2.73232C3.38215 3.07395 3.31279 3.43624 3.28072 3.82239C3.2494 4.19956 3.25 4.6631 3.25 5.22H4.75ZM4.73232 1.55961C4.23005 1.82052 3.82052 2.23005 3.55961 2.73232L4.89073 3.42378C5.00933 3.19548 5.19548 3.00933 5.42378 2.89073L4.73232 1.55961Z" fill="#323539"/>
      </svg>
    );
  }
  