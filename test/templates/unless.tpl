<div class="container">
  <h1>Testing unless-helper</h1>

  <h4>Flag is <span>{{flag}}</span></h4>

  {{#unless flag}}
    <p>This should only be visible if flag is not true</p>
  {{else}}
    <p>This should only be visible if flag is true</p>
  {{/unless}}
</div>