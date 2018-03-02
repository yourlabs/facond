import { JSDOM } from 'jsdom'

const formConfiguration = {
  'cls': 'ddf.form.Form',
  'prefix': '',
  'rules': [
    {
      'cls': 'ddf.rule.Rule',
      'field': 'title',
      'actions': [
        {
          'cls': 'ddf.action.Remove',
          'conditions': [
            {
              'cls': 'ddf.condition.ValueIs',
              'field': 'kind',
              'value': 'nonprofit'
            }
          ]
        }
      ]
    }
  ]
}

const formConfigurationJSON = JSON.stringify(formConfiguration)

const dom = () => new JSDOM(`
<html><body><form>
  <div>
   <div id="name-container">
     <input id="id_name" name="name" />
     <label for="id_name">Name</label>
   </div>
   <div>
     <input id="id_title" name="title" />
     <label for="id_title">Title</label>
   </div>
   <div>
     <input type="radio" id="id_kind_corporate" name="kind">
     <input type="radio" id="id_kind_nonprofit" name="kind">
     <label for="id_kind_corporate"></label>
   </div>
  </div>
  <script type="text/ddf-configuration">
    ${formConfigurationJSON}
  </script>
</form></body></html>
`)

export { dom, formConfiguration }
