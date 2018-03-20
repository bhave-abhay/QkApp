## Welcome to QkApp
A Qk Simple, minimalistic JS app framework for browser

### Requirements
1. Bootstrap 4.0
2. JQuery 3.3.1

### Demo
[See demo](https://bhave-abhay.github.io/qkapp/demo/)

### How to use

Basic Usage:-
```javascript
var app = new QkApp();
window.alert = app.show_alert.bind(app);
```
#### Additional html mark-up
1. `<div data-qkapp-role="alert-container">...</div>`
	- This data propoerty can be used on any container of your choice.
	- All the QkAlerts are pushed into first qkapp alert container in the
document, identified by this attribute.

2. `<div data-qkapp-role="dialog">...</div>`
	- This data propoery is used on a bootstrap dialog element.
	- It's header, footer and body elements are identified with corresponding bootstrap classes.
	- This dialog element is (re)used as the dialog element.
	- For more info, see [Dialog api](#dialog-api) [TODO: Document dialog api].

```javascript
app.show_dialog(
  'Dialog Title',
  'Dialog text goes her. For simple dialogs, it\'s simply string. For more complex interaction, you can use QkForm feature'
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
#### Qk forms
This widget provides a thin wrapper around html forms with ability to
read/write data as a whole object represented in the form rather than
individual bits and pieces. It allows you to read a form's "qk value".
Before giving a value out, it raises a validation event. Listeners to this
event get a veto poll along the event. You can put your veto if data is invalid.

QkVal of a form is either a valid object (no listener vetoed read operation)
or is `undefined`.

The sample login form in demo is created as follows:
##### html
```html
<div id="formLogin" class="container">
	<div class="row">
		<div class="col-12">
			<div class="form-group has-feedback">
				<label for="txtUsername" class="label label-default">Enter user name</label>
				<input type="text" placeholder="User Name" class="form-control" id="txtUsername" data-qkform-causesvalidation="true">
			</div>
		</div>
		<div class="col-12">
			<div class="form-group has-feedback">
				<label for="txtPassword" class="label label-default">Enter password</label>
				<input type="password" placeholder="Password" class="form-control" id="txtPassword" data-qkform-causesvalidation="true">
			</div>
		</div>
		<div class="col-12" data-qkform-role="validation-summary">

		</div>
	</div>
</div>
```
##### additional html mark-up
1. `data-qkform-causesvalidation="true"`
	- This attribute can be used on input of any control in a qk form.
	- With this attribute set to true, the qkform is validated on change of the input
2. `data-qkform-role="validation-summary"`
	- This attribute can be used on any container in the qk form.
	- The ul element containing validation messages list items is appended to this element.

##### javascript
```javascript
var formLogin = $('#formLogin').QkForm({
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
    formLogin.on('qkform:validate', function (evt, vetoPoll) {
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
