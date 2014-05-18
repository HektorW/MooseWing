<div class="container">
  <h1>Testing each helper</h1>

  <ul>
    {{#each items}}
      <li>{{name}}</li>
    {{/each}}
  </ul>

  <ul>
    {{#each items}}
      <li>{{this}}</li>
    {{/each}}
  </ul>
</div>