@isTest
public with sharing class RelatedList_Test {
    @IsTest
    static void getRecords_Test(){
        Test.startTest();
        User testUser = [Select id from user where id = :UserInfo.getUserId()];
        RelatedList.ListResults results = null;
        System.runAs(testUser){
            results = RelatedList.getRecords('Select id from contact limit 10', 'Contact', '');
        }
        
        //checking if the SObject icon name is well retrieved
        System.assertEquals('standard:contact', results.iconName);
        
        Test.stopTest();
        
        
    }

    @IsTest
    static void countRecords_Test(){
        User testUser = [Select id from user where id = :UserInfo.getUserId()];
        Test.startTest();
        System.runAs(testUser){
            RelatedList.countRecords('Contact');
            RelatedList.countRecords(null);
        }
        Test.stopTest();
        
    }
}