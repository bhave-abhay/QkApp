## Welcome to SillyApp
A Silly Simple, minimalistic JS app framework for browser

### Requirements
1. Bootstrap 4.0
2. JQuery 3.3.1

### How to use

Basic Usage:-
```javascript

var app = new SillyApp();
window.alert = app.show_alert.bind(app);
```
#### Additional html mark-up
1. `<div data-sillyapp-role="alert-container">...</div>`
	- This data propoerty can be used on any container of your choice.
	- All the SillyAlerts are pushed into first sillyapp alert container in the
document, identified by this attribute.

2. `<div data-sillyapp-role="dialog">...</div>`
	- This data propoery is used on a bootstrap dialog element.
	- It's header, footer and body elements are identified with corresponding bootstrap classes.
	- This dialog element is (re)used as the dialog element.
	- For more info, see [Dialog api](#dialog-api) [TODO: Document dialog api].

```javascript
app.show_dialog(
  'Dialog Title',
  'Dialog text goes her. For simple dialogs, it\'s simply string. For more complex interaction, you can use SillyForm feature'
).buttons([{
  'sText': 'Button 1',
  'cssClasses': 'btn-warning',
  'onClick': function(){
    app.hide_dialog();
  }
},{
  'sText': 'Button 2',
  'cssClasses': 'btn-danger',
  'onClick': function(){
    app.hide_dialog();
    alert('Button 2 pressed', 'alert-info', 3 /*sec timout*/);
  }
}]);
```
#### Silly forms
This widget provides a thin wrapper around html forms with ability to
read/write data as a whole object represented in the form rather than
individual bits and pieces. It allows you to read a form's "silly value".
Before giving a value out, it raises a validation event. Listeners to this
event get a veto poll along the event. You can put your veto if data is invalid.

SillyVal of a form is either a valid object (no listener vetoed read operation)
or is `undefined`.

The sample login form in demo is created as follows:
##### html
```html
<div id="formLogin" class="container">
	<div class="row">
		<div class="col-12">
			<div class="form-group has-feedback">
				<label for="txtUsername" class="label label-default">Enter user name</label>
				<input type="text" placeholder="User Name" class="form-control" id="txtUsername" data-sillyform-causesvalidation="true">
			</div>
		</div>
		<div class="col-12">
			<div class="form-group has-feedback">
				<label for="txtPassword" class="label label-default">Enter password</label>
				<input type="password" placeholder="Password" class="form-control" id="txtPassword" data-sillyform-causesvalidation="true">
			</div>
		</div>
		<div class="col-12" data-sillyform-role="validation-summary">

		</div>
	</div>
</div>
```
##### additional html mark-up
1. `data-sillyform-causesvalidation="true"`
	- This attribute can be used on input of any control in a silly form.
	- With this attribute set to true, the sillyform is validated on change of the input
2. `data-sillyform-role="validation-summary"`
	- This attribute can be used on any container in the silly form.
	- The ul element containing validation messages list items is appended to this element.

##### javascript
```javascript
var formLogin = $('#formLogin').SillyForm({
        cbGetData: function () {
            return {
                'sUserId': $('#txtUsername').val(),
                'sPswdHash': CryptoJS.SHA512($('#txtPassword').val()).toString().toUpperCase()
            };
        },
        cbShowData: function (objData) {
            $('#txtUsername').val(objData.sUserId);
            $('#txtPassword').val('');
        }
    });
    formLogin.on('sillyform:validate', function (evt, vetoPoll) {
        var eltUserName = $('#txtUsername');
        var eltPswd = $('#txtPassword');
        if (eltUserName.val() === '') {
            vetoPoll.veto('User name not entered', 'txtUsername');
        }
        if (eltPswd.val() === '') {
            vetoPoll.veto('Password not entered', 'txtPassword');
        }
    });
```
### Demo
[A demo with silly wizard sporting a few silly forms in a silly app...](https://bhave-abhay.github.io/sillyapp/test/)
Yeah... it's a silly world!
