document.addEventListener("DOMContentLoaded", function () {
  const brokenImageURL = "../../app/images/missing-image.png";
  let counter = 0;

  document.querySelectorAll("img").forEach((img) => {
    if (img.src === window.location.href) {
      counter++;
      img.src = brokenImageURL;
    }
  });
  console.log(
    counter + " images were missing and replaced with a placeholder."
  );
});
