# Publish test results to zephyr scale

authorization_header="Authorization: Bearer $ZEPHYR_SCALE_TOKEN"

project_key="RR"
auto_create_test_cases="true"
upload_results_url="https://api.zephyrscale.smartbear.com/v2/automations/executions/junit?projectKey=$project_key&autoCreateTestCases=$auto_create_test_cases"

junit_xml_file_path="cypress/results/junit/results.xml\""
file_path="file=@\"$junit_xml_file_path\""

current_date=$(date +"%d-%m-%Y %T")
test_cycle_name="Regression Tests - $current_date"
test_cycle_folder_id="9938623"
test_cycle_json_body="testCycle=
    \"{\\\"name\\\":\\\"$test_cycle_name\\\",
    \\\"folderId\\\": $test_cycle_folder_id
    }\";
    type=application/json"

curl --location --request POST "$upload_results_url" \
--header "$authorization_header" \
--form "$file_path" \
--form "$test_cycle_json_body"