var app = new Vue({
  el: "#app",
  data: {
    profileInput: "",
    currentRequest: "",
    user: false,
    error: false,
    loading: false
  },
  computed: {
    instaUrl: function() {
      return "https://www.instagram.com/" + this.user.username + "/";
    }
  },
  methods: {
    searchUser: function() {
      var profileName = this.getInstaName(this.profileInput.trim());
      if (profileName == "") {
        this.profileInput = "";
        return;
      }

      this.currentRequest = profileName;

      this.loading = true;
      this.user = false;
      this.error = false;

      axios
        .get(
          "/insta/" + profileName
        )
        .then(response => {
          this.loading = false;
          const body = response.data;
          if (body.status == "success") {
            this.user = body.data;
          } else {
            this.error = true;
          }
        })
        .catch(error => {
          this.loading = false;
          this.error = true;
          console.log(error.response);
        });

      // empty the input field
      this.profileInput = "";
    },
    getInstaName: function(text) {
      var result = text.match(
        /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am)\/([A-Za-z0-9-_\.]+)/
      );
      if (result == null) {
        return text;
      } else {
        return result[1];
      }
    },
    fullSize: function() {
      if (this.user) {
        var viewer = ImageViewer();
        viewer.show(this.user.profile_pictures.hd);
      }
    },
    download: function() {
      fetch(this.user.profile_pictures.hd)
        .then(resp => resp.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = this.user.username + ".jpg";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(() => alert("Failed to download image!"));
    }
  }
});
