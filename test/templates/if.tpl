<div class="container">
  <h1>Testing if-helper</h1>

  <h4>Flag is <span>{{flag}}</span></h4>

  {{#if flag}}
    <p>This should only be visible if flag is true</p>
  {{else}}
    <p>This should only be visible if flag is not true</p>
  {{/if}}
</div>