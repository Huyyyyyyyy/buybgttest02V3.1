import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const HomePage = () => {
  return (
    // <Box
    //   sx={{
    //     display: "flex",
    //     flexWrap: "wrap",
    //     justifyContent: "space-evenly",
    //     width: "100%",
    //   }}
    // >
    //   {/* Form hiển thị value */}
    //   <Container
    //     sx={{
    //       maxWidth: { xs: "80%", md: "90%", lg: "60%" },
    //       bgcolor: "black",
    //       opacity: "0.8",
    //       borderRadius: "50px",
    //       p: 4,
    //       boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    //       mb: 10,
    //       color: "black",
    //     }}
    //   >
    //     <Typography
    //       variant="h2"
    //       fontWeight="bold"
    //       gutterBottom
    //       textAlign="center"
    //       sx={{
    //         fontFamily: "'Itim', cursive", // Phông chữ Itim
    //         color: "#fff", // Màu chữ tối
    //         display: "flex", // Sắp xếp chữ và ảnh theo hàng ngang
    //         alignItems: "center", // Canh giữa chữ và ảnh
    //         justifyContent: "center", // Canh giữa cả ảnh và chữ
    //         fontSize: { xs: "20px", sm: "40px", md: "60px" },
    //       }}
    //     >
    //       <img
    //         src="https://dr9rfdtcol2ay.cloudfront.net/assets/BGT.png" // Đường dẫn ảnh từ thư mục public
    //         alt="BGT Icon"
    //         style={{ width: 70, height: 70, marginRight: 8 }} // Điều chỉnh kích thước ảnh và khoảng cách
    //       />
    //       BGT Market
    //     </Typography>

    //     <ToggleButtonGroup
    //       value={activeTab}
    //       exclusive
    //       onChange={(event, newValue) => {
    //         if (newValue != null) {
    //           console.log(activeTab);
    //           setActiveTab(newValue);
    //         }
    //       }}
    //       fullWidth
    //       sx={{
    //         mb: 2,
    //         fontFamily: "Itim, cursive",
    //         borderRadius: "999px",
    //         padding: "4px",
    //         "& .MuiToggleButton-root": {
    //           flex: 1,
    //           fontWeight: "bold",
    //           fontSize: "1rem",
    //           color: "#fff",
    //           border: "none",
    //           borderRadius: "999px",
    //           textTransform: "none",
    //           fontFamily: "Itim, cursive",
    //           transition: "all 0.05s",
    //           "&.Mui-selected": {
    //             backgroundColor: "#FFEA00",
    //             color: "black",
    //             borderRadius: "999px",
    //           },
    //           "&:hover": {
    //             backgroundColor: "inherit", // Keeps non-selected buttons unchanged on hover
    //           },
    //           "&.Mui-selected:hover": {
    //             backgroundColor: "#FFEA00", // Keeps selected buttons #FFEA00 on hover
    //           },
    //         },
    //       }}
    //     >
    //       <ToggleButton value="Buy">Buy BGT</ToggleButton>
    //       <ToggleButton value="Sell">Sell BGT</ToggleButton>
    //     </ToggleButtonGroup>

    //     <TableContainer
    //       component={Paper}
    //       sx={{
    //         bgcolor: "transparent",
    //         color: "#fff",
    //         fontFamily: "'Itim', cursive",
    //       }}
    //     >
    //       <Table sx={{ minWidth: 500 }} aria-label="order table">
    //         {/* TableHead */}
    //         <TableHead>
    //           {activeTab === "Buy" ? (
    //             <TableRow sx={{ border: 0 }}>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 BGT Amount
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Premium
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Estimated to pay
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Address
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Hash
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Time
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Action
    //               </TableCell>
    //             </TableRow>
    //           ) : (
    //             <TableRow sx={{ border: 0 }}>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 BGT Price
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 BGT Amount
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Paid
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Address
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Hash
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Time
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Action
    //               </TableCell>
    //               <TableCell
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   color: "#FFD700",
    //                   fontWeight: "bold",
    //                   border: 0,
    //                   fontSize: "20px",
    //                 }}
    //               >
    //                 Vault
    //               </TableCell>
    //             </TableRow>
    //           )}
    //         </TableHead>
    //         {/* TableBody */}
    //         <TableBody>
    //           {account === "" || displayedOrders === null ? (
    //             <TableRow sx={{ border: 0 }}>
    //               <TableCell sx={{ border: 0 }}>
    //                 <span
    //                   style={{
    //                     fontSize: "24px",
    //                     color: "#fff",
    //                     fontFamily: "'Itim', cursive",
    //                   }}
    //                 >
    //                   Please connect your wallet
    //                 </span>
    //               </TableCell>
    //             </TableRow>
    //           ) : (
    //             displayedOrders.map((order, index) =>
    //               activeTab === "Buy" ? (
    //                 <TableRow key={order.order_id || index} sx={{ border: 0 }}>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {+order.unclaimed_bgt < 0.01
    //                       ? "<0.01"
    //                       : +order.unclaimed_bgt == 0
    //                       ? "0.00"
    //                       : (+order.unclaimed_bgt).toFixed(3)}
    //                     <img
    //                       src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconBGT.png" // Thay bằng đường dẫn đúng tới ảnh trong thư mục assets
    //                       alt="icon"
    //                       style={{
    //                         width: 35,
    //                         height: 30,
    //                         marginLeft: 7,
    //                         verticalAlign: "middle",
    //                       }} // Điều chỉnh kích thước ảnh và khoảng cách
    //                     />
    //                   </TableCell>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {(order.markup - 10000) / 100}%
    //                   </TableCell>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {(
    //                       beraPrice *
    //                       +order.unclaimed_bgt *
    //                       (1 + (order.markup - 10000) / 100 / 100)
    //                     ).toFixed(2)}
    //                     <img
    //                       src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png" // Thay bằng đường dẫn đúng tới ảnh trong thư mục assets
    //                       alt="icon"
    //                       style={{
    //                         width: 22,
    //                         height: 22,
    //                         marginLeft: 7,
    //                         verticalAlign: "middle",
    //                       }} // Điều chỉnh kích thước ảnh và khoảng cách
    //                     />
    //                   </TableCell>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {order.address.slice(0, 6)}...
    //                     {order.address.slice(-4)}
    //                   </TableCell>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     <a
    //                       href={`https://berascan.com/tx/${order.evm_tx_hash}`}
    //                       target="_blank"
    //                       rel="noopener noreferrer"
    //                       style={{ color: "#fff", textDecoration: "none" }}
    //                     >
    //                       {order.evm_tx_hash.slice(0, 6)}...
    //                       {order.evm_tx_hash.slice(-4)}
    //                     </a>
    //                   </TableCell>

    //                   {/* time buy  */}
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {(() => {
    //                       const timeDiffInSeconds =
    //                         Math.floor(Date.now() / 1000) - order.time; // Khoảng cách thời gian (giây)

    //                       // Nếu thời gian nhỏ hơn 24 giờ (86400 giây), hiển thị giờ, phút, giây
    //                       if (timeDiffInSeconds < 86400) {
    //                         const hours = Math.floor(timeDiffInSeconds / 3600); // Số giờ
    //                         const minutes = Math.floor(
    //                           (timeDiffInSeconds % 3600) / 60
    //                         ); // Số phút
    //                         const seconds = timeDiffInSeconds % 60; // Số giây

    //                         // Tạo chuỗi hiển thị
    //                         let timeString = "";
    //                         if (hours > 0)
    //                           timeString += `${hours} hour${
    //                             hours !== 1 ? "s" : ""
    //                           } `;
    //                         if (minutes > 0 || hours > 0)
    //                           timeString += `${minutes} min${
    //                             minutes !== 1 ? "s" : ""
    //                           } `;
    //                         timeString += `${seconds} sec${
    //                           seconds !== 1 ? "s" : ""
    //                         } ago`;

    //                         return timeString;
    //                       }

    //                       // Nếu thời gian lớn hơn hoặc bằng 24 giờ, hiển thị số ngày
    //                       return `${(timeDiffInSeconds / 86400).toFixed(
    //                         0
    //                       )} day${
    //                         (timeDiffInSeconds / 86400).toFixed(0) !== "1"
    //                           ? "s"
    //                           : ""
    //                       } ago`;
    //                     })()}
    //                   </TableCell>
    //                   <TableCell sx={{ border: 0 }}>
    //                     <Button
    //                       variant="contained"
    //                       color={activeTab === "Buy" ? "success" : "error"}
    //                       onClick={
    //                         activeTab === "Buy"
    //                           ? () =>
    //                               fillSellOrder(order.order_id, order.amount)
    //                           : () =>
    //                               fillBuyOrder(
    //                                 order.order_id,
    //                                 "0xc2baa8443cda8ebe51a640905a8e6bc4e1f9872c"
    //                               )
    //                       }
    //                       sx={{ borderRadius: "12px" }}
    //                     >
    //                       {activeTab === "Buy" ? "Buy" : "Sell"}
    //                     </Button>
    //                   </TableCell>
    //                 </TableRow>
    //               ) : (
    //                 <TableRow key={order.order_id || index} sx={{ border: 0 }}>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     ${(+order.price).toFixed(2)}
    //                   </TableCell>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {(+order.filled_bgt_amount).toFixed(2)}/
    //                     {(+order.bgt_amount).toFixed(2)}
    //                     <img
    //                       src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconBGT.png" // Thay bằng đường dẫn đúng tới ảnh trong thư mục assets
    //                       alt="icon"
    //                       style={{
    //                         width: 35,
    //                         height: 30,
    //                         marginLeft: 7,
    //                         verticalAlign: "middle",
    //                       }} // Điều chỉnh kích thước ảnh và khoảng cách
    //                     />
    //                   </TableCell>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {(+order.amount).toFixed(2)}
    //                     <img
    //                       src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png" // Thay bằng đường dẫn đúng tới ảnh trong thư mục assets
    //                       alt="icon"
    //                       style={{
    //                         width: 22,
    //                         height: 22,
    //                         marginLeft: 7,
    //                         verticalAlign: "middle",
    //                       }} // Điều chỉnh kích thước ảnh và khoảng cách
    //                     />
    //                   </TableCell>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {order.address.slice(0, 6)}...
    //                     {order.address.slice(-4)}
    //                   </TableCell>
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     <a
    //                       href={`https://berascan.com/tx/${order.evm_tx_hash}`}
    //                       target="_blank"
    //                       rel="noopener noreferrer"
    //                       style={{ color: "#fff", textDecoration: "none" }}
    //                     >
    //                       {order.evm_tx_hash.slice(0, 6)}...
    //                       {order.evm_tx_hash.slice(-4)}
    //                     </a>
    //                   </TableCell>
    //                   {/* time sell min hours */}
    //                   <TableCell
    //                     sx={{
    //                       color: "#fff",
    //                       fontFamily: "'Itim', cursive",
    //                       fontSize: "20px",
    //                       border: 0,
    //                     }}
    //                   >
    //                     {(() => {
    //                       const timeDiffInSeconds =
    //                         Math.floor(Date.now() / 1000) - order.time; // Khoảng cách thời gian (giây)

    //                       // Nếu thời gian nhỏ hơn 24 giờ (86400 giây), hiển thị giờ, phút, giây
    //                       if (timeDiffInSeconds < 86400) {
    //                         const hours = Math.floor(timeDiffInSeconds / 3600); // Số giờ
    //                         const minutes = Math.floor(
    //                           (timeDiffInSeconds % 3600) / 60
    //                         ); // Số phút
    //                         const seconds = timeDiffInSeconds % 60; // Số giây

    //                         // Tạo chuỗi hiển thị
    //                         let timeString = "";
    //                         if (hours > 0)
    //                           timeString += `${hours} hour${
    //                             hours !== 1 ? "s" : ""
    //                           } `;
    //                         if (minutes > 0 || hours > 0)
    //                           timeString += `${minutes} min${
    //                             minutes !== 1 ? "s" : ""
    //                           } `;
    //                         timeString += `${seconds} sec${
    //                           seconds !== 1 ? "s" : ""
    //                         } ago`;

    //                         return timeString;
    //                       }

    //                       // Nếu thời gian lớn hơn hoặc bằng 24 giờ, hiển thị số ngày
    //                       return `${(timeDiffInSeconds / 86400).toFixed(
    //                         0
    //                       )} day${
    //                         (timeDiffInSeconds / 86400).toFixed(0) !== "1"
    //                           ? "s"
    //                           : ""
    //                       } ago`;
    //                     })()}
    //                   </TableCell>
    //                   <TableCell sx={{ border: 0 }}>
    //                     <Button
    //                       variant="contained"
    //                       color={activeTab === "Buy" ? "success" : "error"}
    //                       onClick={
    //                         activeTab === "Buy"
    //                           ? () =>
    //                               fillSellOrder(order.order_id, order.amount)
    //                           : () => fillBuyOrder(order.order_id, vaultForFill)
    //                       }
    //                       sx={{ borderRadius: "12px" }}
    //                     >
    //                       {activeTab === "Buy" ? "Buy" : "Sell"}
    //                     </Button>
    //                   </TableCell>
    //                   <TableCell sx={{ border: 0 }}>
    //                     <FormControl fullWidth>
    //                       <InputLabel
    //                         id={`dropdown-labelило-${order.order_id}`}
    //                         sx={{
    //                           color: "#fff",
    //                           fontFamily: "'Itim', cursive'",
    //                         }} // Chữ trắng cho nhãn
    //                       >
    //                         💰
    //                       </InputLabel>

    //                       <Select
    //                         labelId={`dropdown-label-${order.order_id}`}
    //                         value={vaultForFill}
    //                         onChange={(e) => setVaultForFill(e.target.value)}
    //                         label="Choose Vault"
    //                         sx={{
    //                           color: "#fff", // Chữ trắng cho giá trị được chọn
    //                           bgcolor: "rgba(0, 0, 0, 0.1)", // Nền đen mờ (80% opacity)
    //                           fontFamily: "'Itim', cursive'", // Phông chữ Itim
    //                           "& .MuiSvgIcon-root": { color: "#fff" }, // Icon mũi tên trắng
    //                           "& .MuiOutlinedInput-notchedOutline": {
    //                             borderColor: "#fff",
    //                           }, // Viền trắng
    //                           "&:hover .MuiOutlinedInput-notchedOutline": {
    //                             borderColor: "#fff",
    //                           }, // Viền trắng khi hover
    //                           "& .MuiPaper-root": {
    //                             bgcolor: "rgba(0, 0, 0, 1)",
    //                           }, // Đảm bảo dropdown menu full đen
    //                         }}
    //                         MenuProps={{
    //                           PaperProps: {
    //                             sx: {
    //                               bgcolor: "rgba(0, 0, 0, 1)", // Nền đen đầy đủ cho dropdown
    //                               "& .MuiMenuItem-root": {
    //                                 color: "#fff", // Chữ trắng cho tất cả các mục trong dropdown
    //                                 bgcolor: "rgba(0, 0, 0, 1)", // Nền đen đầy đủ cho các mục
    //                                 "&:hover": { bgcolor: "#333" }, // Hiệu ứng hover xám đậm
    //                               },
    //                             },
    //                           },
    //                         }}
    //                       >
    //                         <MenuItem
    //                           value=""
    //                           sx={{
    //                             bgcolor: "rgba(0, 0, 0, 1)",
    //                             color: "#fff",
    //                           }}
    //                         >
    //                           <em
    //                             style={{
    //                               color: "#fff",
    //                               fontFamily: "'Itim', cursive'",
    //                             }}
    //                           >
    //                             Choose Vault
    //                           </em>{" "}
    //                           {/* Chữ trắng cho mục mặc định */}
    //                         </MenuItem>
    //                         {vaultsWithBalance.map((vault) =>
    //                           vault.name !== "" &&
    //                           vault.icon !== "" &&
    //                           vault.bgtBalance > 0 ? (
    //                             <MenuItem
    //                               key={vault.reward_vault}
    //                               value={vault.reward_vault}
    //                               disabled={parseFloat(vault.bgtBalance) <= 0}
    //                               sx={{
    //                                 bgcolor: "rgba(0, 0, 0, 1)", // Nền đen đầy đủ cho các mục
    //                                 color: "#fff", // Chữ trắng cho các mục
    //                                 fontFamily: "'Itim', cursive'", // Phông chữ Itim
    //                                 "&:hover": { bgcolor: "#333" }, // Hiệu ứng hover xám đậm
    //                               }}
    //                             >
    //                               <Box
    //                                 sx={{
    //                                   display: "flex",
    //                                   alignItems: "center",
    //                                   justifyContent: "space-between",
    //                                   width: "100%",
    //                                 }}
    //                               >
    //                                 <Box
    //                                   sx={{
    //                                     display: "flex",
    //                                     alignItems: "center",
    //                                   }}
    //                                 >
    //                                   <img
    //                                     src={vault.icon}
    //                                     alt={vault.name}
    //                                     style={{
    //                                       width: "20px",
    //                                       height: "20px",
    //                                       marginRight: "8px",
    //                                     }}
    //                                   />
    //                                   {vault.name}
    //                                 </Box>
    //                                 <Typography
    //                                   variant="body2"
    //                                   sx={{ color: "#fff" }}
    //                                 >
    //                                   {" "}
    //                                   {/* Chữ trắng cho số dư */}(
    //                                   {vault.bgtBalance} BGT)
    //                                 </Typography>
    //                               </Box>
    //                             </MenuItem>
    //                           ) : null
    //                         )}
    //                       </Select>
    //                     </FormControl>
    //                   </TableCell>
    //                 </TableRow>
    //               )
    //             )
    //           )}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //     <TablePagination
    //       component="div"
    //       count={total}
    //       page={page}
    //       onPageChange={handleChangePage}
    //       rowsPerPage={rowsPerPage}
    //       onRowsPerPageChange={handleChangeRowsPerPage}
    //       rowsPerPageOptions={[5, 10, 25, 50, 100]}
    //       sx={{
    //         color: "#fff", // Màu chữ trắng cho tất cả các phần trong TablePagination
    //         fontFamily: "'Itim', cursive", // Thay đổi phông chữ toàn bộ
    //         "& .MuiTablePagination-caption": {
    //           color: "#fff", // Màu chữ cho "Rows per page"
    //           fontFamily: "'Itim', cursive", // Phông chữ cho phần "Rows per page"
    //         },
    //         "& .MuiTablePagination-selectLabel": {
    //           color: "#fff", // Màu chữ cho nhãn "Rows per page:"
    //           fontFamily: "'Itim', cursive", // Phông chữ cho nhãn "Rows per page:"
    //         },
    //         "& .MuiTablePagination-select": {
    //           color: "#fff", // Màu chữ cho dropdown chọn số hàng
    //           fontFamily: "'Itim', cursive", // Phông chữ cho dropdown
    //         },
    //         "& .MuiTablePagination-actions": {
    //           color: "#fff", // Màu chữ cho các nút điều hướng (next, previous)
    //           fontFamily: "'Itim', cursive", // Phông chữ cho nút điều hướng
    //         },
    //         textAlign: "center", // Căn giữa toàn bộ phần TablePagination
    //       }}
    //     />
    //   </Container>

    //   {/* Form Tạo Lệnh (Đã chỉnh sửa giao diện phần Mua BGT) */}
    //   <Container
    //     sx={{
    //       maxWidth: { xs: "80%", md: "90%", lg: "34%" },
    //       height: "100%",
    //       bgcolor: "black",
    //       opacity: "0.8",
    //       borderRadius: "50px",
    //       p: 4,
    //       // mb:10,
    //       boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    //       // margin: "0 auto",
    //       // marginTop: { xs: "0", sm: "0", md: "168px" },
    //       padding: { sm: "60px 20px" },
    //       color: "#fff",
    //     }}
    //   >
    //     <Typography
    //       variant="h4"
    //       fontWeight="bold"
    //       gutterBottom
    //       textAlign="center"
    //       sx={{ fontFamily: "'Itim', cursive" }}
    //     >
    //       Create Order
    //     </Typography>

    //     {account && (
    //       <Box sx={{ mb: 3 }}>
    //         {/* số dư bera trong ví */}
    //         <Typography
    //           variant="subtitle1"
    //           sx={{
    //             fontFamily: "'Itim', cursive",
    //             display: "flex",
    //             alignItems: "center",
    //           }}
    //         >
    //           <img
    //             src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
    //             alt="BERA"
    //             style={{ width: 25, height: 25, marginRight: 8 }}
    //           />
    //           BERA: {parseFloat(beraBalance).toFixed(2)}
    //         </Typography>
    //       </Box>
    //     )}

    //     <Box sx={{ mb: 3 }}>
    //       <ToggleButtonGroup
    //         value={orderType}
    //         exclusive
    //         onChange={(event, newValue) => {
    //           if (newValue !== null) setOrderType(newValue);
    //         }}
    //         fullWidth
    //         sx={{
    //           mb: 2,
    //           fontFamily: "Itim, cursive",
    //           borderRadius: "999px",
    //           backgroundColor: "rgba(0,0,0,0.6)",
    //           padding: "4px",
    //           "& .MuiToggleButton-root": {
    //             flex: 1,
    //             fontWeight: "bold",
    //             fontSize: "1rem",
    //             color: "#fff",
    //             border: "none",
    //             borderRadius: "999px",
    //             textTransform: "none",
    //             fontFamily: "Itim, cursive",
    //             transition: "all 0.05s",
    //             "&.Mui-selected": {
    //               backgroundColor: "#FFEA00",
    //               color: "black",
    //               borderRadius: "999px",
    //             },
    //           },
    //         }}
    //       >
    //         <ToggleButton value="Buy">Buy BGT</ToggleButton>
    //         <ToggleButton value="Sell">Sell BGT</ToggleButton>
    //         <ToggleButton value="Buy Orders">Buy Orders</ToggleButton>
    //         <ToggleButton value="Sell Orders">Sell Orders</ToggleButton>
    //       </ToggleButtonGroup>

    //       {orderType === "Buy" ? (
    //         account === "" ? (
    //           <>
    //             <Box>
    //               <Typography
    //                 variant="body1"
    //                 sx={{
    //                   mb: 1,
    //                   fontFamily: "Itim, cursive",
    //                   fontWeight: "bold",
    //                   fontSize: "1.1rem",
    //                 }}
    //               >
    //                 Please connect your wallet
    //               </Typography>
    //             </Box>
    //           </>
    //         ) : (
    //           <>
    //             <Box
    //               sx={{
    //                 mb: 2,
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "space-between",
    //               }}
    //             >
    //               <Box sx={{ width: "50%" }}>
    //                 <Typography
    //                   variant="body1"
    //                   sx={{
    //                     mb: 1,
    //                     fontFamily: "Itim, cursive",
    //                     fontWeight: "bold",
    //                     fontSize: "1.1rem",
    //                   }}
    //                 >
    //                   BGT Price ($)
    //                 </Typography>

    //                 <TextField
    //                   variant="outlined"
    //                   fullWidth
    //                   placeholder="$"
    //                   value={price}
    //                   onChange={(e) => setPrice(e.target.value)}
    //                   sx={{
    //                     borderRadius: "12px",
    //                     backgroundColor: "#f5f5f5",
    //                     fontFamily: "Itim, cursive",
    //                     "& input": {
    //                       fontFamily: "Itim, cursive",
    //                       fontWeight: "bold",
    //                       fontSize: "1rem",
    //                     },
    //                   }}
    //                 />
    //               </Box>
    //               <Box sx={{ textAlign: "right" }}>
    //                 <Typography
    //                   variant="body2"
    //                   sx={{
    //                     fontFamily: "'Itim', cursive",
    //                     display: "flex",
    //                     alignItems: "center",
    //                   }}
    //                 >
    //                   <img
    //                     src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
    //                     alt="BERA Price"
    //                     style={{ width: 23, height: 23, marginRight: 8 }}
    //                   />
    //                   BERA Price:{" "}
    //                   {beraPrice
    //                     ? `$${parseFloat(beraPrice).toFixed(2)}`
    //                     : "N/A"}
    //                 </Typography>
    //               </Box>
    //             </Box>

    //             <Box
    //               sx={{
    //                 mb: 2,
    //                 display: "flex",
    //                 gap: 1,
    //                 justifyContent: "center",
    //               }}
    //             >
    //               {percentagePresets.map((percentage) => (
    //                 <Button
    //                   key={percentage}
    //                   variant={
    //                     selectedPercentage === percentage
    //                       ? "contained"
    //                       : "outlined"
    //                   } // Thay đổi variant dựa trên trạng thái
    //                   onClick={() => {
    //                     setSelectedPercentage(percentage); // Cập nhật state khi nhấp
    //                     setAmountByPercentage(percentage); // Gọi hàm tính toán số lượng
    //                   }}
    //                   sx={{
    //                     borderRadius: "12px",
    //                     minWidth: "60px",
    //                     fontSize: "1rem",
    //                     fontFamily: "'Itim', cursive",
    //                     color:
    //                       selectedPercentage === percentage ? "#000" : "#fff", // Màu chữ đen khi chọn, trắng khi không chọn
    //                     backgroundColor:
    //                       selectedPercentage === percentage
    //                         ? "#ffca28"
    //                         : "transparent", // Màu nền vàng khi chọn
    //                     borderColor: "#fff", // Viền trắng mặc định
    //                     "&:hover": {
    //                       backgroundColor: "#ffca28", // Màu nền khi hover
    //                       color: "#000", // Màu chữ khi hover
    //                       borderColor: "#ffca28", // Viền khi hover
    //                     },
    //                   }}
    //                 >
    //                   {percentage}%
    //                 </Button>
    //               ))}
    //             </Box>

    //             <Box sx={{ mb: 2 }}>
    //               <Typography
    //                 variant="body1"
    //                 sx={{
    //                   mb: 1,
    //                   fontFamily: "Itim, cursive", // Phông chữ cho label
    //                   fontWeight: "700", // Đậm chữ
    //                   color: "fff", // Màu chữ tối
    //                 }}
    //               >
    //                 Buying Amount ($HONEY)
    //               </Typography>
    //               <TextField
    //                 variant="outlined"
    //                 fullWidth
    //                 sx={{
    //                   borderRadius: "12px",
    //                   backgroundColor: "#f5f5f5", // Nền mờ như yêu cầu
    //                   "& .MuiInputBase-input": {
    //                     fontFamily: "Itim, cursive", // Phông chữ cho input
    //                     fontWeight: "700", // Đậm chữ nhập vào
    //                     color: "#333", // Màu chữ tối
    //                   },
    //                   "& .MuiOutlinedInput-notchedOutline": {
    //                     border: "none", // Không viền
    //                   },
    //                 }}
    //                 value={amount} // Số lượng BGT
    //                 onChange={(e) => setAmount(e.target.value)}
    //               />
    //             </Box>

    //             <Box
    //               sx={{
    //                 mb: 2,
    //                 display: "flex",
    //                 alignItems: "center",
    //               }}
    //             >
    //               <Typography
    //                 variant="body2"
    //                 sx={{ fontFamily: "'Itim', cursive", marginRight: 1 }}
    //               >
    //                 Balance:
    //               </Typography>
    //               <Box sx={{ display: "flex", alignItems: "center" }}>
    //                 <img
    //                   src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png"
    //                   alt="Honey"
    //                   style={{ width: 20, height: 20, marginRight: 4 }} // Giảm khoảng cách giữa icon và giá trị
    //                 />
    //                 <Typography
    //                   variant="body2"
    //                   sx={{ fontFamily: "'Itim', cursive" }}
    //                 >
    //                   {parseFloat(honeyBalance).toFixed(2)}
    //                 </Typography>
    //               </Box>
    //             </Box>
    //             <Box
    //               sx={{
    //                 mb: 2,
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //               }}
    //             >
    //               <Typography variant="body2">
    //                 Honey to pay (≥ 10.00)
    //               </Typography>
    //               {/* <Typography variant="body2">0 🐻</Typography> */}
    //             </Box>
    //             <Button
    //               variant="contained"
    //               color="success"
    //               onClick={createOrder}
    //               fullWidth
    //               disabled={buyStatus === "Success" ? false : true}
    //               sx={{
    //                 py: 1.5,
    //                 fontWeight: "bold",
    //                 borderRadius: "20px",
    //                 boxShadow: "0 4px 12px rgba(0, 128, 0, 0.3)",
    //                 fontFamily: "'Itim', cursive",
    //                 fontSize: "1.2rem",
    //                 backgroundColor: "#14ED00",
    //                 "&:hover": {
    //                   backgroundColor: "#12C900",
    //                 },
    //                 "&.Mui-disabled": {
    //                   backgroundColor: "#14ED00",
    //                   opacity: 1,
    //                   color: "#fff",
    //                 },
    //               }}
    //             >
    //               {buyStatus === "Success" ? "Buy" : "Processing..."}
    //             </Button>
    //           </>
    //         )
    //       ) : orderType === "Sell" ? (
    //         account === "" ? (
    //           <>
    //             <Box>
    //               <Typography
    //                 variant="body1"
    //                 sx={{
    //                   mb: 1,
    //                   fontFamily: "Itim, cursive",
    //                   fontWeight: "bold",
    //                   fontSize: "1.1rem",
    //                 }}
    //               >
    //                 Please connect your wallet
    //               </Typography>
    //             </Box>
    //           </>
    //         ) : (
    //           <>
    //             <FormControl fullWidth sx={{ mb: 2 }}>
    //               <InputLabel id="vault-label">Reward Vault</InputLabel>
    //               <Select
    //                 labelId="vault-label"
    //                 value={selectedVault}
    //                 label="Reward Vault"
    //                 onChange={(e) => setSelectedVault(e.target.value)}
    //                 sx={{
    //                   borderRadius: "12px",
    //                   backgroundColor: "#f5f5f5",
    //                 }}
    //               >
    //                 <MenuItem value="">
    //                   <em>Choose Vault</em>
    //                 </MenuItem>
    //                 {vaultsWithBalance.map((vault) =>
    //                   vault.name !== "" && vault.icon !== "" ? (
    //                     <MenuItem
    //                       key={vault.reward_vault}
    //                       value={vault.reward_vault}
    //                       disabled={parseFloat(vault.bgtBalance) <= 0}
    //                     >
    //                       <Box
    //                         sx={{
    //                           display: "flex",
    //                           alignItems: "center",
    //                           justifyContent: "space-between",
    //                           width: "100%",
    //                         }}
    //                       >
    //                         <Box sx={{ display: "flex", alignItems: "center" }}>
    //                           <img
    //                             src={vault.icon}
    //                             alt={vault.name}
    //                             style={{
    //                               width: "20px",
    //                               height: "20px",
    //                               marginRight: "8px",
    //                             }}
    //                           />
    //                           {vault.name}
    //                         </Box>
    //                         <Typography
    //                           variant="body2"
    //                           sx={{ color: "text.secondary" }}
    //                         >
    //                           {vault.bgtBalance} BGT
    //                         </Typography>
    //                       </Box>
    //                     </MenuItem>
    //                   ) : null
    //                 )}
    //               </Select>
    //             </FormControl>

    //             <Box
    //               sx={{
    //                 mb: 2,
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "space-between",
    //               }}
    //             >
    //               <TextField
    //                 label="BGT Premium Rate (%)"
    //                 variant="outlined"
    //                 sx={{
    //                   width: "50%",
    //                   borderRadius: "12px",
    //                   backgroundColor: "#f5f5f5",
    //                 }}
    //                 value={premiumRate}
    //                 onChange={(e) => setPremiumRate(e.target.value)}
    //                 // placeholder="ví dụ: 10 cho 110%"
    //               />
    //               {/* giá bera sell */}
    //               <Typography
    //                 variant="body2"
    //                 sx={{
    //                   fontFamily: "'Itim', cursive",
    //                   display: "flex",
    //                   alignItems: "center",
    //                 }}
    //               >
    //                 <img
    //                   src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
    //                   alt="BERA Price"
    //                   style={{ width: 23, height: 23, marginRight: 8 }}
    //                 />
    //                 BERA Price:{" "}
    //                 {beraPrice ? `$${parseFloat(beraPrice).toFixed(2)}` : "N/A"}
    //               </Typography>
    //             </Box>
    //             {/* phần trăm sell */}
    //             <Box
    //               sx={{
    //                 mb: 2,
    //                 display: "flex",
    //                 gap: 1,
    //                 justifyContent: "center",
    //               }}
    //             >
    //               {percentagePresets.map((rate) => (
    //                 <Button
    //                   key={rate}
    //                   variant={
    //                     premiumRate === rate.toString()
    //                       ? "contained"
    //                       : "outlined"
    //                   }
    //                   onClick={() => setPremiumRate(rate.toString())}
    //                   sx={{
    //                     borderRadius: "12px",
    //                     minWidth: "60px",
    //                     fontSize: "1rem", // Điều chỉnh kích thước chữ
    //                     fontFamily: "'Itim', cursive", // Thay đổi phông chữ
    //                     backgroundColor:
    //                       premiumRate === rate.toString()
    //                         ? "#ffca28"
    //                         : "transparent", // Màu nền của nút khi được chọn
    //                     color:
    //                       premiumRate === rate.toString() ? "black" : "inherit", // Màu chữ khi được chọn
    //                     borderColor: "#fff", // Màu viền
    //                     "&:hover": {
    //                       backgroundColor: "#ffca28", // Màu nền khi hover (giống màu chọn)
    //                       color: "#000", // Màu chữ khi hover
    //                     },
    //                   }}
    //                 >
    //                   {rate}%
    //                 </Button>
    //               ))}
    //             </Box>

    //             <Box
    //               sx={{
    //                 mb: 2,
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //               }}
    //             >
    //               <Typography variant="body2">BGT in vault (≥0.01)</Typography>
    //               {/* <Typography variant="body2">0 🐻</Typography> */}
    //             </Box>
    //             <Box
    //               sx={{
    //                 mb: 2,
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //               }}
    //             >
    //               {/* <Typography variant="body2">Ước tính nhận được</Typography>
    //             <Typography variant="body2">0 🐻</Typography> */}
    //             </Box>
    //             {/* nút bán sell */}
    //             <Button
    //               variant="contained"
    //               color="success"
    //               onClick={createOrder}
    //               fullWidth
    //               disabled={sellStatus === "Success" ? false : true}
    //               sx={{
    //                 py: 1.5,
    //                 fontWeight: "bold",
    //                 borderRadius: "20px",
    //                 boxShadow: "0 4px 12px rgba(0, 128, 0, 0.3)",
    //                 fontFamily: "'Itim', cursive",
    //                 fontSize: "1.2rem", // Kích thước chữ
    //                 backgroundColor: "#FF0000", // Màu nền của nút
    //                 "&:hover": {
    //                   backgroundColor: "#FF3333", // Màu khi hover (có thể điều chỉnh)
    //                 },
    //                 "&.Mui-disabled": {
    //                   backgroundColor: "#FF0000",
    //                   opacity: 1,
    //                   color: "#fff",
    //                 },
    //               }}
    //             >
    //               {sellStatus === "Success" ? "Sell" : "Processing..."}
    //             </Button>
    //           </>
    //         )
    //       ) : orderType === "Buy Orders" ? (
    //         <>
    //           <TableContainer component={Paper}>
    //             {account === "" ? (
    //               <Table sx={{ minWidth: 200 }} aria-label="order table">
    //                 <TableBody>
    //                   <TableRow>
    //                     <TableCell>Please connect your wallet</TableCell>
    //                   </TableRow>
    //                 </TableBody>
    //               </Table>
    //             ) : buyOrdersAccount === null ? (
    //               <Table sx={{ minWidth: 200 }} aria-label="order table">
    //                 <TableBody>
    //                   <TableRow>
    //                     <TableCell>No order</TableCell>
    //                   </TableRow>
    //                 </TableBody>
    //               </Table>
    //             ) : (
    //               <Table sx={{ maxWidth: 200 }} aria-label="order table">
    //                 <TableHead>
    //                   <TableRow>
    //                     <TableCell>BGT Price</TableCell>
    //                     <TableCell>BGT Amount</TableCell>
    //                     <TableCell>Type</TableCell>
    //                     <TableCell>Action</TableCell>
    //                   </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                   {displayBuyOrdersAccount.map((order, index) => (
    //                     <TableRow key={order.order_id || index}>
    //                       <TableCell>{order.price}</TableCell>
    //                       <TableCell>
    //                         {(+order.filled_bgt_amount).toFixed(2)}/
    //                         {(+order.bgt_amount).toFixed(2)}
    //                       </TableCell>
    //                       <TableCell style={{ color: "green" }}>Buy</TableCell>
    //                       <TableCell>
    //                         <Button
    //                           variant="contained"
    //                           color={order.state === 1 ? "success" : "gray"}
    //                           disabled={order.state === 1 ? false : true}
    //                           onClick={() => closeOrder(order.order_id, "Buy")}
    //                           sx={{ borderRadius: "12px" }}
    //                         >
    //                           {order.state === 1 ? "Close" : "Closed"}
    //                         </Button>
    //                       </TableCell>
    //                     </TableRow>
    //                   ))}
    //                 </TableBody>
    //               </Table>
    //             )}
    //           </TableContainer>
    //           <TablePagination
    //             style={{ backgroundColor: "white" }}
    //             component="div"
    //             count={totalPersonalBuy}
    //             page={pagePersonalBuy}
    //             onPageChange={handleChangePagePersonalBuy}
    //             rowsPerPage={rowsPerPagePersonalBuy}
    //             onRowsPerPageChange={handleChangeRowsPerPagePersonalBuy}
    //             rowsPerPageOptions={[5, 10, 25, 50]}
    //           />
    //         </>
    //       ) : (
    //         <>
    //           <TableContainer component={Paper}>
    //             {account === "" ? (
    //               <Table sx={{ minWidth: 200 }} aria-label="order table">
    //                 <TableBody>
    //                   <TableRow>
    //                     <TableCell>Please connect your wallet</TableCell>
    //                   </TableRow>
    //                 </TableBody>
    //               </Table>
    //             ) : sellOrdersAccount === null ? (
    //               <Table sx={{ minWidth: 200 }} aria-label="order table">
    //                 <TableBody>
    //                   <TableRow>
    //                     <TableCell>No order</TableCell>
    //                   </TableRow>
    //                 </TableBody>
    //               </Table>
    //             ) : (
    //               <Table sx={{ maxWidth: 100 }} aria-label="order table">
    //                 <TableHead>
    //                   <TableRow>
    //                     <TableCell>Premium</TableCell>
    //                     <TableCell>Sold Amount</TableCell>
    //                     <TableCell>Profit</TableCell>
    //                     <TableCell>Action</TableCell>
    //                   </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                   {displaySellOrdersAccount.map((order, index) => (
    //                     <TableRow key={order.order_id || index}>
    //                       <TableCell>{(order.markup - 10000) / 100}%</TableCell>
    //                       <TableCell>
    //                         {+order.unclaimed_bgt < 0.01
    //                           ? "<0.01"
    //                           : +order.unclaimed_bgt == 0
    //                           ? "0.00"
    //                           : (+order.unclaimed_bgt).toFixed(3)}
    //                       </TableCell>
    //                       <TableCell>
    //                         {(
    //                           beraPrice *
    //                           +order.unclaimed_bgt *
    //                           (1 + (order.markup - 10000) / 100 / 100)
    //                         ).toFixed(2)}
    //                       </TableCell>
    //                       <TableCell>
    //                         <Button
    //                           variant="contained"
    //                           color={order.state === 1 ? "success" : "gray"}
    //                           disabled={order.state === 1 ? false : true}
    //                           onClick={() => closeOrder(order.order_id, "Sell")}
    //                           sx={{ borderRadius: "12px" }}
    //                         >
    //                           {order.state === 1 ? "Close" : "Closed"}
    //                         </Button>
    //                       </TableCell>
    //                     </TableRow>
    //                   ))}
    //                 </TableBody>
    //               </Table>
    //             )}
    //           </TableContainer>
    //           <TablePagination
    //             style={{ backgroundColor: "white" }}
    //             component="div"
    //             count={totalPersonalSell}
    //             page={pagePersonalSell}
    //             onPageChange={handleChangePagePersonalSell}
    //             rowsPerPage={rowsPerPagePersonalSell}
    //             onRowsPerPageChange={handleChangeRowsPerPagePersonalSell}
    //             rowsPerPageOptions={[5, 10, 25, 50, 100]}
    //           />
    //         </>
    //       )}
    //     </Box>
    //     {status && (
    //       <Typography variant="body2" color="text.secondary" textAlign="center">
    //         {status}
    //       </Typography>
    //     )}
    //   </Container>
    // </Box>
    <>
      <div style={{ minHeight: "1200px" }}></div>
    </>
  );
};

export default HomePage;
