let projectLocation, record;
import curDot from "cursor-dot";
const cursor = curDot({
  diameter: 60,
  easing: 4,
  background: "#fff",
});

cursor.classList.add("cursor-class");
const blackHidder = document.getElementById("black");
var Airtable = require("airtable");
function hideSpinner() {
  blackHidder.classList.add("hide");
}
var base = new Airtable({ apiKey: "keyMKnZBFsdFtC0UX" }).base(
  "appvMjgA3Di00eDev"
);
base("Work")
  .select({
    view: "Grid view",
  })
  .eachPage(
    function page(records) {
      let searchParam = document.location.search;
      searchParam = searchParam.substring(1);
      record = records.filter((x) => x.fields.Slug == searchParam);
      projectLocation = records.findIndex(
        (x) => x.fields.Slug === record[0].fields.Slug
      );
      record = record[0].fields;
      hideSpinner();
      document.body.style.backgroundColor = record.backgroundColor;
      createInterface(record, records);
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
function createInterface(record, records) {
  var links = document.getElementsByTagName("a");
  var found;
  for (var i = 0; i < links.length; i++) {
    if (links[i].innerHTML === record["Project Name"]) {
      found = links[i];
      found.style.color = "white";
    }
  }
  let Pname = document.getElementById("ProjectName");
  let Pyear = document.getElementById("year");
  let Psub = document.getElementById("Subtitle");
  let Pdesc = document.getElementById("Description");
  let PdescOne = document.getElementById("Description-1");
  let PdescTwo = document.getElementById("Description-2");

  let Prole = document.getElementById("Role");
  let Pproccess = document.getElementById("extra-info");
  let PfinalProjectSrc = document.getElementById("live-link");
  let nextProjectSrc = document.getElementById("next-work-link");
  let nextProjectSrcMob = document.getElementById("next-work-link-mob");

  let backProjectSrc = document.getElementById("back-work-link");
  let backProjectSrcMob = document.getElementById("back-work-link-mob");

  Pname.innerHTML = record["Project Name"];
  Pyear.innerHTML = record.Year;
  Psub.innerHTML = record.Subtitle;
  Pdesc.innerHTML = record.Description;
  Prole.innerHTML = record.Role;
  PfinalProjectSrc.href = record["Project Final Src"];
  Pproccess.innerHTML = record.Process;
  let techLength = record.Technology.length;

  if (record.DescExtraOne) {
    var txtNodeOne = document.createElement("P");
    txtNodeOne.innerHTML = record.DescExtraOne;
    txtNodeOne.classList.add("d");
    Pdesc.after(txtNodeOne);
    if (record.DescExtraTwo) {
      var txtNodeTwo = document.createElement("P");
      txtNodeTwo.innerHTML = record.DescExtraTwo;
      txtNodeTwo.classList.add("d");
      txtNodeTwo.classList.add("quote");
      txtNodeOne.after(txtNodeTwo);
      if (record.DescExtraThree) {
        var txtNodeThree = document.createElement("P");
        txtNodeThree.innerHTML = record.DescExtraThree;
        txtNodeThree.classList.add("d");
        txtNodeThree.classList.add("quote");
        txtNodeTwo.after(txtNodeThree);
        if (record.DescExtraFour) {
          var txtNodeFour = document.createElement("P");
          txtNodeFour.innerHTML = record.DescExtraFour;
          txtNodeFour.classList.add("d");
          txtNodeFour.classList.add("quote");
          txtNodeThree.after(txtNodeFour);
        }
      }
    }
  }

  for (i = 0; i < techLength; i++) {
    var txtNode = document.createElement("P");
    txtNode.innerHTML = record.Technology[i];
    document.getElementById("tech-stack").appendChild(txtNode);
  }

  if (record.viz) {
    var vizLink = document.createElement("iframe");
    vizLink.src = record.viz;
    document.getElementById("img-handler").appendChild(vizLink);
    vizLink.classList.add("data-viz");
  }

  let imgLength = record.Img1.length;
  for (i = 0; i < imgLength; i++) {
    var img = document.createElement("img");
    img.src = record.Img1[i].url;
    document.getElementById("img-handler").appendChild(img);
  }

  if (record.yt) {
    var targetWidth = document.getElementById("img-handler").offsetWidth;
    var vidLink1 = document.createElement("iframe");
    vidLink1.width = targetWidth;
    vidLink1.height = targetWidth * 0.5625;
    vidLink1.src = record.yt;
    document.getElementById("img-handler").appendChild(vidLink1);
    vidLink1.setAttribute("allowFullScreen", "");
  }

  if (record["Extra Links"]) {
    var targetWidth = document.getElementById("img-handler").offsetWidth;
    var vidLink = document.createElement("iframe");
    vidLink.width = targetWidth;
    vidLink.height = targetWidth * 0.5625;
    vidLink.src = record["Extra Links"];
    document.getElementById("img-handler").appendChild(vidLink);
    vidLink.setAttribute("allowFullScreen", "");
  }

  let nextProjectBtn = document.getElementById("nxt-project");
  let nextProjectBtnMob = document.getElementById("nxt-project-mob");

  nextProjectBtn.addEventListener("click", () => {
    projectLocation = (projectLocation + 1) % records.length;
    if (projectLocation === 0) {
      projectLocation = 1;
    }
    var nextProjectHref =
      "content.html?" + records[projectLocation].fields.Slug;
    console.log(nextProjectHref);
    nextProjectSrc.href = nextProjectHref;
  });

  nextProjectBtnMob.addEventListener("click", () => {
    projectLocation = (projectLocation + 1) % records.length;
    if (projectLocation === 0) {
      projectLocation = 1;
    }
    var nextProjectHrefMob =
      "content.html?" + records[projectLocation].fields.Slug;
    nextProjectSrcMob.href = nextProjectHrefMob;
    console.log(nextProjectSrcMob.href);
  });

  let backwards = document.getElementById("back-project");
  let backwardsMob = document.getElementById("back-project-mob");
  backwards.addEventListener("click", () => {
    if (projectLocation == 1) {
      projectLocation = records.length;
    }
    projectLocation = (projectLocation - 1) % records.length;
    var backProjectHref =
      "content.html?" + records[projectLocation].fields.Slug;
    backProjectSrc.href = backProjectHref;
  });

  backwardsMob.addEventListener("click", () => {
    if (projectLocation == 1) {
      projectLocation = records.length;
    }
    projectLocation = (projectLocation - 1) % records.length;
    var backProjectHrefMob =
      "content.html?" + records[projectLocation].fields.Slug;
    backProjectSrcMob.href = backProjectHrefMob;
    console.log(backProjectSrcMob.href);
  });
}
