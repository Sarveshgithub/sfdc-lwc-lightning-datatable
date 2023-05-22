public class IconUtils {
    public static String getIconName(String sObjectName) {
        String iconName = 'custom:custom7';
        List<Schema.DescribeTabSetResult> tabSetDesc = Schema.describeTabs();
        List<Schema.DescribeTabResult> tabDesc = new List<Schema.DescribeTabResult>();
        List<Schema.DescribeIconResult> iconDesc = new List<Schema.DescribeIconResult>();

        for (Schema.DescribeTabSetResult tsr : tabSetDesc) {
            tabDesc.addAll(tsr.getTabs());
        }
        for (Schema.DescribeTabResult tr : tabDesc) {
            iconName = 'standard:' + sObjectName.toLowerCase();
            break;
        }
        return iconName;
    }
}
