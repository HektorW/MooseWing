<div class="container">
  <h1>Testing nested each helper</h1>

  <ul>
    {{#each items}}
      <li>
        {{name}}
        <ul>
          {{#each subitems}}
            <li>{{name}} in subtree {{../name}}</li>
          {{/each}}
        </ul>
      </li>
    {{/each}}
  </ul>
</div>