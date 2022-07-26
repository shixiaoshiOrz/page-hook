import { Input,Switch, Select,CheckboxGroup, Dialog,Button,Table,Tag,Card,Checkbox, Message,Drawer,Empty,Divider,Collapse,CollapseItem,TableColumn ,Badge,MessageBox,Link} from 'element-ui';
let element = {
  install: function (Vue) {
    Vue.use(Empty);
    Vue.use(Drawer);
    Vue.use(Input);
    Vue.use(Switch);
    Vue.use(Select);
    Vue.use(Button);
    Vue.use(Table);
    Vue.use(Tag);
    Vue.use(Divider);
    Vue.use(Card);
    Vue.use(Collapse);
    Vue.use(TableColumn);
    Vue.use(CollapseItem);
    Vue.use(Link);
    Vue.use(Badge);
    Vue.use(Checkbox);
    Vue.use(CheckboxGroup);
     Vue.use(Dialog);

    
    Vue.prototype.$message = Message;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$ELEMENT = { size: 'small'};
  }
}
export default element
