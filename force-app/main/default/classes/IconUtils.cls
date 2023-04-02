public class IconUtils {
    public static String getIconName(String sObjectName) {
        //test
        String iconName = '';
        List<Schema.DescribeTabSetResult> tabSetDesc = Schema.describeTabs();
        List<Schema.DescribeTabResult> tabDesc = new List<Schema.DescribeTabResult>();
        List<Schema.DescribeIconResult> iconDesc = new List<Schema.DescribeIconResult>();

        for (Schema.DescribeTabSetResult tsr : tabSetDesc) {
            tabDesc.addAll(tsr.getTabs());
        }

        for (Schema.DescribeTabResult tr : tabDesc) {
            if (sObjectName == tr.getSobjectName()) {
                if (tr.isCustom() == true) {
                    iconDesc.addAll(tr.getIcons());
                } else {
                    iconName = 'standard:' + sObjectName.toLowerCase();
                    break;
                }
            }
        }

        for (Schema.DescribeIconResult ir : iconDesc) {
            if (ir.getContentType() == 'image/svg+xml') {
                iconName =
                    'custom:' +
                    ir.getUrl()
                        .substringBetween('custom/', '.svg')
                        .substringBefore('_');
                break;
            }
        }

        return iconName;
    }
}
