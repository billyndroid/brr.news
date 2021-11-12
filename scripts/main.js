
//from w3schools.com
function myFunction() {
    document.documentElement.style.scrollBehavior = "smooth";
  }

//from https://coolcssanimation.com/how-to-trigger-a-css-animation-on-scroll/

//from https://coolcssanimation.com/how-to-trigger-a-css-animation-on-scroll/
const wrapper = document.getElementById("scroll-animation-wrapper");
const className = "in-view";

wrapper.classList.remove(className);

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				wrapper.classList.add(className);
				return;
			}

			wrapper.classList.remove(className);
		});
	},
	{
		threshold: 1
	}
);

observer.observe(wrapper);
