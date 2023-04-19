@isTest
public with sharing class RelatedList_Test {
    @TestSetup
    static void makeData() {
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        Contact cont = new Contact(
            FirstName = 'First',
            LastName = 'Last',
            Accountid = testAccount.id
        );
        insert cont;
    }
    @isTest
    static void buildFieldJSON_Test() {
        Test.startTest();
        User testUser = [SELECT id FROM user WHERE id = :UserInfo.getUserId()];
        RelatedList.ListResults results;
        System.runAs(testUser) {
            results = RelatedList.buildFieldJSON(
                'SELECT ID,FirstName,Accountid,Account.Name From Contact',
                'Contact',
                '',
                '{ "AccountId":{"label":"Account Record Id"}, "Account.Name": { "label": "Account Name", "type": "text" }  }'
            );
        }
        System.assertEquals(results != null, true);
        Test.stopTest();
    }
    @IsTest
    static void getRecords_Test() {
        Test.startTest();
        User testUser = [SELECT id FROM user WHERE id = :UserInfo.getUserId()];
        List<Sobject> results;
        System.runAs(testUser) {
            results = RelatedList.getRecords('Select id from contact limit 10');
        }
        System.assertEquals(results.size() > 0, true);
        Test.stopTest();
    }

    @IsTest
    static void countRecords_Test() {
        User testUser = [SELECT id FROM user WHERE id = :UserInfo.getUserId()];
        Test.startTest();
        System.runAs(testUser) {
            RelatedList.countRecords('Contact', '');
            RelatedList.countRecords(null, '');
        }
        Test.stopTest();
    }

    @IsTest
    static void onSearch_Test() {
        Test.startTest();
        User testUser = [SELECT id FROM user WHERE id = :UserInfo.getUserId()];
        List<SObject> results;
        System.runAs(testUser) {
            Test.setFixedSearchResults(
                new List<Id>{ [SELECT Id FROM Contact LIMIT 1][0].Id }
            );
            results = RelatedList.onSearch(
                'Fi',
                'Contact',
                'FirstName,LastName',
                'FirstName = \'First\''
            );
        }
        System.assertEquals(results.size() > 0, true);
        Test.stopTest();
    }

    @IsTest
    static void initPicklistColumn_Test() {
        Map<String, RelatedList.ColumnJson> colsJson = new Map<String, RelatedList.ColumnJson>{
            'StageName' => new RelatedList.ColumnJson()
        };

        RelatedList.initPicklistColumn(colsJson, 'Opportunity', 'StageName');

        RelatedList.TypeAttributeColumnJsonWithPicklist typesAttributesPicklist = (RelatedList.TypeAttributeColumnJsonWithPicklist) colsJson.get('StageName').typeAttributes;
        System.assert(
            typesAttributesPicklist.options.size() >= 0
        );
    }
}