# Project Performance Testing

## Overview
This project involves performance testing of the testing site [PetStore](https://petstore.octoperf.com/actions/Catalog.action) using the BlazeMeter extension, JMeter, and command-line commands for report generation.

## Tools Used
- **BlazeMeter Extension**: Used for recording and running performance tests.
- **JMeter**: For detailed analysis of load testing scenarios.
- **Command-line commands**: Used to execute JMeter tests and generate reports.
- **Google Chrome**: Used to navigate and interact with the test site.

## Testing Process
1. **Test Scenario Recording**: 
   - Recorded user interactions on the PetStore site using the BlazeMeter extension.
   - Captured actions such as browsing categories, adding items to the cart, and checking out.

2. **Performance Test Execution**: 
   - Ran the recorded script through BlazeMeter.
   - Configured virtual users (VUs) to simulate multiple users accessing the site simultaneously.
   - Opened the file on JMeter
   - Used JMeter (Thread group) to conduct further load testing.
   - Executed JMeter tests via command-line commands and generated performance reports.
   
   Constrains:
  - Number of Threads (users): 500, 700, 800, 1000, 1100
  - Ramp-Up Period (in seconds): 10
  - Loop Count: 1 

  ### Make jtl file

```bash
  jmeter -n -t  Performance_Testing_t500.jmx -l report\Performance_Testing_t500.jtl
```  

### Make html file 
  ```bash
  jmeter -g report\Performance_Testing_t500.jtl -o report\Performance_Testing_t500.html
```
   
3. **Metrics Collected**:
   - Response time for each page.
   - Throughput (requests per second).
   - Error rate under load conditions.
   - Resource utilization and bottlenecks.

## Results & Analysis
- Observed the impact of concurrent users on website performance.
- Identified response time variations under different load conditions.
- Analyzed bottlenecks that may require optimization.
- Generated detailed performance reports using command-line commands in JMeter.

The following table presents the results of the performance tests:

| Concurrent Users | Loop Count | Avg TPS | Error Rate (%) | Total Concurrent Users |
| ---------------- | ---------- | ------- | -------------- | ---------------------- |
| 500              | 1          | 93      | 0.00           | 4800                   |
| 700             | 1          | 99      | 0.00           | 6000                   |
| 800             | 1          | 93     | 0.00           | 4800                   |
| 1000             | 1          | 198     | 0.07           | 12000                  |
| 1100             | 1          | 198     | 0.07           | 12000                  |

## Observations

- The API performs well under 500 concurrent users, with an average TPS of 50 and a minimal error rate.
- As the number of concurrent users increases, the TPS gradually decreases, and the error rate rises.
- At 2000 concurrent users, a significant drop in TPS (198) and a higher error rate (0.7%) indicate potential system bottlenecks.


## Conclusion
Performance testing with BlazeMeter, JMeter, and command-line execution provided valuable insights into the scalability and reliability of the PetStore application. Future steps may involve optimizing server response times and improving resource handling under heavy loads.

## How to Reproduce the Test
1. Install the **BlazeMeter Chrome Extension**.
2. Navigate to [PetStore](https://petstore.octoperf.com/actions/Catalog.action).
3. Start recording user actions and save the file as .jmx.
4. Execute the test on JMeter and analyze results.
5. Run JMeter scripts via command-line commands to generate detailed reports.
