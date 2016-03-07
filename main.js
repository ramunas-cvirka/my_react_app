$(document).ready(function() {
  var ref = new Firebase("https://ramunas.firebaseio.com");
  var auth = ref.getAuth();
  if (auth) {
    $('#gplus').addClass('fa-sign-out').removeClass('fa-google-plus');
  }
});

function auth() {
  var ref = new Firebase("https://ramunas.firebaseio.com");
  if ($('#gplus').hasClass('fa-sign-out')) {
    ref.unauth();
    $('#gplus').addClass('fa-google-plus').removeClass('fa-sign-out');
    Lobibox.notify('info', {
      size: 'mini',
      msg: 'Signed out successfully.'
    });
  }
  else {
    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        type = 'error';
      } else {
        type = 'success';
        error = 'Authenticated successfully.';
        $('#gplus').addClass('fa-sign-out').removeClass('fa-google-plus');
      }
      Lobibox.notify(type, {
        size: 'mini',
        msg: error
      });
    });
  }
}

function postingDialog() {

}

var PosterComp = React.createClass({
  mixins: [ReactFireMixin],
  // propTypes: {
  //   post: React.PropTypes.object
  // },
  getInitialState: function() {
    return {
      part1: '',
      part2: '',
      part3: '',
      part4: ''
    };
  },
  handlePart1Change: function(e) {
    this.setState({part1: e.target.value});
  },
  handlePart2Change: function(e) {
    this.setState({part2: e.target.value});
  },
  handlePart3Change: function(e) {
    this.setState({part3: e.target.value});
  },
  handlePart4Change: function(e) {
    this.setState({part4: e.target.value});
  },
  componentWillMount: function() {
    var ref = new Firebase("https://ramunas.firebaseio.com/posts");
    this.bindAsArray(ref.limitToLast(25), "posts");
  },
  handleSubmit: function(e) {
    e.preventDefault();

    this.firebaseRefs['posts'].push({
      post: {
        date: Date.now(),
        impactful_news: this.state.part1,
        wisecrack: this.state.part2,
        code_snippet: this.state.part3,
        code_description: this.state.part4
      }
    }, function(res_obj) {
      var type = 'success'
      var msg = 'The entry was saved!'
      if (res_obj) {
        type = 'error'
        msg = 'Something went terribly wrong!'
      } else {
      }
      Lobibox.notify(type, {
        size: 'mini',
        msg: msg
      });
    });

    this.setState({
      part1: '',
      part2: '',
      part3: '',
      part4: ''
    });

  },
  render: function() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date();
    return React.DOM.div({
      className: "field-group"
      },
      React.DOM.span({
        className: "badge"
        },
        date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear()
      ),
      React.DOM.input({
        className: "field",
        placeholder: "Impactful piece of news",
        value: this.state.part1,
        onChange: this.handlePart1Change
      }),
      React.DOM.input({
        className: "field",
        placeholder: "Wisecrack",
        value: this.state.part2,
        onChange: this.handlePart2Change
      }),
      React.DOM.textarea({
        className: "field",
        placeholder: "Code Snippet",
        value: this.state.part3,
        onChange: this.handlePart3Change
      }),
      React.DOM.input({
        className: "field",
        placeholder: "Code Description",
        value: this.state.part4,
        onChange: this.handlePart4Change
      }),
      React.DOM.button({
        className: "button button--ghost-primary button--xsmall",
        onClick: this.handleSubmit
      }, 'Submit')
    );
  }
});

ReactDOM.render(
  React.createElement(PosterComp, {}),
  document.getElementById('main')
);
